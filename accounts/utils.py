import secrets
import string

def generate_secret_key(length=50):
    chars = string.ascii_letters + string.digits + '!@#$%^&*(-_=+)'
    return ''.join(secrets.choice(chars) for _ in range(length))

print(generate_secret_key())