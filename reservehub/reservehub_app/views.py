from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.models import Group
from django.http import HttpResponse
from rest_framework_jwt.settings import api_settings
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import AppUser
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
from django.shortcuts import render
from .utils import MyTokenObtainPairSerializer
from .models import PasswordToken, DeleteAccountToken

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

                subject_template_name='reservehub_app/reset_password_email_subject.txt'
                email_template_name='reservehub_app/reset_password_email.html'
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
            return Response({'message': 'Der Link zum Zurücksetzen Ihres Passworts ist abgelaufen. Bitte fordern Sie einen neuen an'},
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


from paypalrestsdk import Api, WebhookEvent
# Again, make sure to keep your secret key safe!
import stripe
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
stripe.api_key = "pk_test_51Npf9cH8ERUGOPnDJ0EBYRWpj0iVjzAvR8aswLVIBNnB4Qw39croBqRKLzma14Y2JeWU4PYOd7rxbtaDjSpUb9qT00FTk7mgvC"

# This is your Stripe CLI webhook secret for testing your endpoint locally.
endpoint_secret = 'whsec_03c0503ba2d6e748f2b87b76e9f0eb0d289948eae4c9d3a933f6803a7a3f34e2'
@csrf_exempt
def webhook(request):
    if request.method == 'POST':
        event = None
        payload = request.body
        sig_header = request.headers.get('STRIPE_SIGNATURE')

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, endpoint_secret
            )
        except ValueError as e:
            # Invalid payload
            return JsonResponse({'error': 'Invalid payload'}, status=400)
        except stripe.error.SignatureVerificationError as e:
            # Invalid signature
            return JsonResponse({'error': 'Invalid signature'}, status=400)

        # Handle the event
        if event['type'] == 'payment_intent.succeeded':
            payment_intent = event['data']['object']
        # ... handle other event types
        else:
            print('Unhandled event type {}'.format(event['type']))

        return JsonResponse({'success': True})

    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
