import pytest
from django.contrib.auth.models import User


@pytest.fixture
def user():
    return User.objects.create_user(
        username='test user',
        password='test password',
        email='test@example.com'
    )
