def jwt_payload_handler(user):
    return {
        'user_id': user.pk,
        'email': user.email,
        'role': 'Superuser' if user.is_superuser else ('Admin' if user.is_admin else 'User'),
        'email_confirmed': user.email_confirmed,
    }
