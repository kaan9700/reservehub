import json
from django.utils.decorators import method_decorator
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.models import Group
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import AppUser, SubscriptionPlan, SubscriptionServices, ReceivedPayments
from django.db import IntegrityError
from django.contrib.auth.tokens import default_token_generator
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import send_mail
from django.contrib.sites.shortcuts import get_current_site
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes, force_str
from django.utils import timezone
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from .utils import MyTokenObtainPairSerializer, SubscriptionPlanSerializer, SubscriptionServicesSerializer
from .models import PasswordToken, DeleteAccountToken
from django.views.generic import View
from paypalrestsdk import notifications
from django.conf import settings
from django_ratelimit.decorators import ratelimit









@api_view(['GET'])
def getRoutes(request):
    routes = [
        {
            'Endpoint': '/register/',
            'method': 'POST',
            'description': 'Creates an User with Email and Password'
        },
        {
            'Endpoint': '/login/',
            'method': 'POST',
            'description': 'Checks if the Email and Password are valid and returns whether a error or a success'
        }
    ]
    return Response(routes)


class RegisterView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        email = request.data['email']
        password = request.data['password']
        password_confirmation = request.data['confirm']
        phone = request.data.get('phone')

        if not email:
            return Response({'error': 'Bitte geben Sie eine E-Mail an'}, status=400)

        if not password:
            return Response({'error': 'Bitte geben Sie ein Passwort an'}, status=400)

        if not phone:
            return Response({'error': 'Bitte geben Sie eine Telefonnummer an'}, status=400)

        if not password_confirmation:
            return Response({'error': 'Bitte geben Sie die Passwortbestätigung an'}, status=400)

        if password != password_confirmation:
            return Response({'error': 'Passwörter stimmen nicht überein'}, status=400)

        if AppUser.objects.filter(email=email).exists():
            return Response({"message": 'Ein Konto mit diesem Benutzernamen existiert bereits'}, status=400)

        try:
            user = AppUser(email=email, phone=phone)
            user.set_password(password)
            user.save()
            # Call send_confirmation_email function after user is created
            send_confirmation_email(request, user)
            # Assign group
            standard_users_group, created = Group.objects.get_or_create(name='Standard Users')
            user.groups.add(standard_users_group)
        except IntegrityError as e:
            return Response({'error': 'An error occurred while creating the user.'}, status=500)

        return Response({'message': 'success'}, status=200)


def send_confirmation_email(request, user):
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    current_site = get_current_site(request)
    mail_subject = 'Aktivieren Sie Ihren Account.'
    message = render_to_string('reservehub_app/acc_active_email.html', {
        'user': user,
        'domain': current_site.domain,
        'uid': urlsafe_base64_encode(force_bytes(user.pk)),
        'token': token,
    })
    send_mail(mail_subject, message, 'k.erbay9700@gmail.com', [user.email])


def activate(request, uidb64, token):
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = AppUser.objects.get(pk=uid)
        if default_token_generator.check_token(user, token):
            user.email_confirmed = True
            user.last_login = timezone.now()
            user.save()
            return HttpResponse('Thank you for your email confirmation. Now you can login your account.')
        else:
            return HttpResponse('Activation link is invalid!')
    except:
        user = None
        return HttpResponse('Activation link is invalid!')


class LoginView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({'message': 'Please provide both email and password'},
                            status=status.HTTP_400_BAD_REQUEST)

        user = AppUser.objects.filter(email=email).first()

        if user is None:
            return Response({'message': 'Kein Benutzer unter dieser Email gefunden'},
                            status=status.HTTP_401_UNAUTHORIZED)

        if not user.email_confirmed:
            return Response({'message': 'E-Mail Adresse wurde nicht bestätigt'},
                            status=status.HTTP_401_UNAUTHORIZED)

        if not user.check_password(password):
            return Response({'message': 'Das Passwort ist nicht korrekt'},
                            status=status.HTTP_401_UNAUTHORIZED)

        user.last_login = timezone.now()
        user.save()

        serializer = MyTokenObtainPairSerializer(data=request.data)

        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        else:
            return Response({'message': serializer.errors}, status=status.HTTP_401_UNAUTHORIZED)


class PasswordResetRequestView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'message': 'Bitte geben Sie eine E-Mail Adresse an'}, status=400)
        associated_users = AppUser.objects.filter(email=email)

        if associated_users.exists():
            for user in associated_users:
                c = {
                    'email': user.email,
                    'domain': 'localhost:3000',
                    'uidb64': urlsafe_base64_encode(force_bytes(user.pk)),
                    'token': default_token_generator.make_token(user),
                    'protocol': 'http',
                }

                token_model = PasswordToken(user=user, token=default_token_generator.make_token(user))
                token_model.save()

                subject_template_name = 'reservehub_app/reset_password_email_subject.txt'
                email_template_name = 'reservehub_app/reset_password_email.html'
                subject = render_to_string(subject_template_name, c)

                # remove new lines from the subject
                subject = ''.join(subject.splitlines())
                email = render_to_string(email_template_name, c)
                send_mail(subject, email, 'k.erbay9700@gmail.com', [user.email], fail_silently=False)
            return Response({'message': 'E-Mail zum Zurücksetzen des Passworts wurde gesendet'}, status=200)
        else:
            return Response({'message': 'Es existiert kein Benutzer mit dieser E-Mail Adresse'}, status=400)


class PasswordResetConfirmView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request, uidb64=None, token=None):
        UserModel = AppUser
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = UserModel._default_manager.get(pk=uid)
        except (TypeError, ValueError, OverflowError, UserModel.DoesNotExist):
            user = None

        # Verwende die validate_token Methode, um den Token zu überprüfen
        if user is not None and UserModel._default_manager.validate_token(user, token, 'reset'):
            new_password = request.data.get('password')
            confirmed_password = request.data.get('confirm')

            if new_password != confirmed_password:
                return Response({'message': 'Passwörter stimmen nicht überein'}, status=400)

            user.set_password(new_password)
            user.save()

            subject_template_name = 'reservehub_app/reset_password_email_subject.txt'
            email_template_name = 'reservehub_app/reset_password_confirm_email.html'
            subject = render_to_string(subject_template_name)
            subject = ''.join(subject.splitlines())
            email = render_to_string(email_template_name)

            send_mail(subject, email, 'k.erbay9700@gmail.com', [user.email], fail_silently=False)
            return Response({'message': 'Das Passwort wurde erfolgreich geändert'}, status=200)
        else:
            return Response({
                'message': 'Der Link zum Zurücksetzen Ihres Passworts ist abgelaufen. Bitte fordern Sie einen neuen an'},
                status=400)


class TokenRefreshView(APIView):
    permission_classes = [AllowAny, ]

    def post(self, request):
        refresh_token = request.data.get('refresh')
        if refresh_token is None:
            return Response({'error': 'No refresh token provided'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh_token)
            data = {'access': str(token.access_token)}
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'Invalid refresh token'}, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    permission_classes = [AllowAny, ]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'result': status.HTTP_200_OK})
        except Exception as e:
            print(e)
            return Response({'result: status.HTTP_400_BAD_REQUEST'})


class DeleteAccountView(APIView):
    permission_classes = [IsAuthenticated]  # Stellen Sie sicher, dass der Benutzer authentifiziert ist

    def post(self, request):
        email = request.user  # Der aktuell authentifizierte Benutzer
        if not email:
            return Response({'message': 'Ein Fehler ist aufgetreten, bitte versuchen Sie es später wieder'}, status=400)
        associated_users = AppUser.objects.filter(email=email)

        if associated_users.exists():
            for user in associated_users:
                c = {
                    'email': user.email,
                    'domain': 'localhost:3000',
                    'uidb64': urlsafe_base64_encode(force_bytes(user.pk)),
                    'token': default_token_generator.make_token(user),
                    'protocol': 'http',
                }
                token_model = DeleteAccountToken(user=user, token=default_token_generator.make_token(user))
                token_model.save()

                subject_template_name = 'reservehub_app/delete_account_subject.txt'
                email_template_name = 'reservehub_app/delete_account_email.html'
                subject = render_to_string(subject_template_name, c)
                # remove new lines from the subject
                subject = ''.join(subject.splitlines())
                email = render_to_string(email_template_name, c)
                send_mail(subject, email, 'k.erbay9700@gmail.com', [user.email], fail_silently=False)

            return Response({'message': 'E-Mail zur Löschung des Kontos wurde gesendet'}, status=200)
        else:
            return Response({'message': 'Es existiert kein Benutzer mit dieser E-Mail Adresse'}, status=400)


class DeleteAccountConfirmView(APIView):
    permission_classes = [IsAuthenticated]  # Stellen Sie sicher, dass der Benutzer authentifiziert ist

    def post(self, request, uidb64=None, token=None):
        UserModel = AppUser
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = UserModel._default_manager.get(pk=uid)
        except (TypeError, ValueError, OverflowError, UserModel.DoesNotExist):
            user = None

        # Verwende die validate_token Methode, um den Token zu überprüfen
        if user is not None and UserModel._default_manager.validate_token(user, token, 'delete'):
            try:
                user.delete()
                return Response({"message": "Account erfolgreich gelöscht."}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        # Füge einen Standardfall hinzu
        return Response({"message": "Ungültiger Token oder Benutzer existiert nicht."},
                        status=status.HTTP_400_BAD_REQUEST)


class SubscriptionPlanListView(APIView):
    def get(self, request):
        plans = SubscriptionPlan.objects.all()
        serializer = SubscriptionPlanSerializer(plans, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        method_type = request.data.get('method')

        if method_type == 'add':
            data = {key: value for key, value in request.data.items() if key != 'method'}

            # Umwandeln der Liste in einen String, falls notwendig
            if 'included_services' in data:
                try:
                    data['included_services'] = ','.join(data['included_services'])
                except TypeError:
                    return Response({"error": "included_services should be a list"}, status=status.HTTP_400_BAD_REQUEST)

            serializer = SubscriptionPlanSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


        elif method_type == 'change':
            old_plan_id = request.data.get('old_plan_id')

            new_plan_data = request.data.get(
                'new_data')  # Nehmen wir an, dass die neuen Daten unter dem Schlüssel 'new_data' geschickt werden.
            new_plan_data.pop('old_plan_id')

            if 'included_services' in new_plan_data:
                try:
                    new_plan_data['included_services'] = ','.join(new_plan_data['included_services'])
                except TypeError:
                    return Response({"error": "included_services should be a list"}, status=status.HTTP_400_BAD_REQUEST)

            try:

                existing_plan = SubscriptionPlan.objects.get(plan_id=old_plan_id)

            except SubscriptionPlan.DoesNotExist:

                return Response({'error': 'Plan does not exist'}, status=status.HTTP_404_NOT_FOUND)

            # Aktualisieren des Plans mit den neuen Daten.

            serializer = SubscriptionPlanSerializer(existing_plan, data=new_plan_data, partial=True)

            if serializer.is_valid():
                serializer.save()

                return Response(serializer.data, status=status.HTTP_200_OK)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        elif method_type == 'delete':
            plan_id = request.data.get('plan_id')
            try:
                plan = SubscriptionPlan.objects.get(plan_id=plan_id)
            except SubscriptionPlan.DoesNotExist:
                return Response({'error': 'Plan does not exist'}, status=status.HTTP_404_NOT_FOUND)

            plan.delete()
            return Response({'status': 'Plan deleted'}, status=status.HTTP_204_NO_CONTENT)

        else:
            return Response({'error': 'Invalid method type'}, status=status.HTTP_400_BAD_REQUEST)


class SubscriptionServicesListView(APIView):
    def get(self, request):
        services = SubscriptionServices.objects.all()
        serializer = SubscriptionServicesSerializer(services, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        method_type = request.data.get('method')

        if method_type == 'add':
            data = {key: value for key, value in request.data.items() if key != 'method'}
            serializer = SubscriptionServicesSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        elif method_type == 'change':
            old_service_data = request.data.get('old_data')
            old_service_id = old_service_data.get('id')
            new_service_data = request.data.get('new_data')  # Nehmen wir an, dass die neuen Daten unter dem Schlüssel 'new_data' geschickt werden.
            new_service_data.pop('old_service_id', None)

            try:
                existing_service = SubscriptionServices.objects.get(id=old_service_id)
            except SubscriptionServices.DoesNotExist:
                return Response({'error': 'Service does not exist'}, status=status.HTTP_404_NOT_FOUND)

            serializer = SubscriptionServicesSerializer(existing_service, data=new_service_data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        elif method_type == 'delete':
            service_id = request.data.get('service_id')
            try:
                service = SubscriptionServices.objects.get(id=service_id)
            except SubscriptionServices.DoesNotExist:
                return Response({'error': 'Service does not exist'}, status=status.HTTP_404_NOT_FOUND)

            service.delete()

            return Response({'status': 'Service deleted'}, status=status.HTTP_204_NO_CONTENT)

        else:
            return Response({'error': 'Invalid method type'}, status=status.HTTP_400_BAD_REQUEST)






@method_decorator(ratelimit(key='ip', rate='500/m', block=True), name='dispatch')
class ReceivedPaymentsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # Daten aus dem POST-Request extrahieren
            data = json.loads(request.body)
            transaction_id = data.get('transaction_id')
            user_mail = data.get('user_mail')
            plan_id = data.get('plan_id')

            payment, created = ReceivedPayments.objects.update_or_create(
                user_mail=user_mail,
                defaults={
                    'transaction_id': transaction_id,
                    'plan_id': plan_id
                }
            )

            if created:
                return Response({'message': 'Payment record successfully created'}, status=201)
            else:
                return Response({'message': 'Payment record successfully updated'}, status=200)

        except Exception as e:
            return Response({'status': 'error', 'message': str(e)}, status=400)




@method_decorator(csrf_exempt, name='dispatch')
@method_decorator(ratelimit(key='ip', rate='500/m', block=True), name='dispatch')
class ProcessWebHookView(View):
    def post(self, request):

        # Rate-Limiting überprüfen
        was_limited = getattr(request, 'limited', False)
        if was_limited:
            return HttpResponse(status=429)

        if "HTTP_PAYPAL_TRANSMISSION_ID" not in request.META:
            return HttpResponse(status=400)

        auth_algo = request.META['HTTP_PAYPAL_AUTH_ALGO']
        cert_url = request.META['HTTP_PAYPAL_CERT_URL']
        transmission_id = request.META['HTTP_PAYPAL_TRANSMISSION_ID']
        transmission_sig = request.META['HTTP_PAYPAL_TRANSMISSION_SIG']
        transmission_time = request.META['HTTP_PAYPAL_TRANSMISSION_TIME']
        webhook_id = settings.PAYPAL_WEBHOOK_ID
        event_body = request.body.decode(request.encoding or "utf-8")

        valid = notifications.WebhookEvent.verify(
            transmission_id=transmission_id,
            timestamp=transmission_time,
            webhook_id=webhook_id,
            event_body=event_body,
            cert_url=cert_url,
            actual_sig=transmission_sig,
            auth_algo=auth_algo,
        )

        if not valid:
            return HttpResponse(status=400)

        webhook_event = json.loads(event_body)

        event_type = webhook_event["event_type"]

        if event_type == 'PAYMENT.SALE.COMPLETED':

            subscription_id = webhook_event["resource"]["billing_agreement_id"]
            custom_id = webhook_event['resource']['custom']

            try:
                try:
                    user = AppUser.objects.get(subscription_id=subscription_id)

                    #Falls der user gefunden wurde soll das Feld subscription_end aktualisiert werden. subscription_end soll heute in einem Monat liegen.
                    user.subscription_end = timezone.now() + timezone.timedelta(days=30)
                    user.save()

                except AppUser.DoesNotExist:
                    payment = ReceivedPayments.objects.get(transaction_id=custom_id)
                    user_email = payment.user_mail

                    # Versuche, den Benutzer zu finden, der die Zahlung getätigt hat und aktualisiere das Feld subscription_id und subscription_end. Wobei subscription end heute in einem Monat liegt. AUsserdem soll is_admin auf True gesetzt werden.
                    user = AppUser.objects.get(email=user_email)
                    user.subscription_id = subscription_id
                    user.subscription_end = timezone.now() + timezone.timedelta(days=30)
                    user.is_admin = True
                    user.save()

                    # Get the plan_id from the payment record
                    plan_id = payment.plan_id

                    # Get the plan name from the plan_id
                    plan_name = SubscriptionPlan.objects.get(plan_id=plan_id).plan_name

                    # get the price from the plan_id
                    price = SubscriptionPlan.objects.get(plan_id=plan_id).price
                    c = {
                        'email': user.email,
                        'package_name': plan_name,
                        'monthly_price': price,
                    }

                    subject_template_name = 'reservehub_app/subscription.txt'
                    email_template_name = 'reservehub_app/subscription.html'
                    subject = render_to_string(subject_template_name, c)
                    subject = ''.join(subject.splitlines())
                    email = render_to_string(email_template_name, c)






                    send_mail(subject, email, 'k.erbay9700@gmail.com', [user.email], fail_silently=False)


            except Exception as e:
                print(f'Error while processing payment: {e}')
                return HttpResponse(status=400)


        return HttpResponse(status=200)

