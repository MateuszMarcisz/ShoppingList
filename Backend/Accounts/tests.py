from django.test import TestCase, Client
from django.urls import reverse

import pytest
from rest_framework import status


@pytest.mark.django_db
def test_registration_view():
    client = Client()
    url = reverse('user-register')
    data = {
        "username": "test",
        "password": "test",
        "email": "test@example.com"
    }
    response = client.post(url, data)
    assert response.status_code == status.HTTP_201_CREATED


@pytest.mark.django_db
def test_login_view(user):
    client = Client()
    url = reverse('user-login')
    data = {
        "username": "test user",
        "password": "test password",
    }
    response = client.post(url, data)
    assert response.status_code == status.HTTP_200_OK
    assert 'token' in response.json()
    # print(response.json())


@pytest.mark.django_db
def test_login_view_wrong_password(user):
    client = Client()
    url = reverse('user-login')
    data = {
        "username": "test user",
        "password": "wrong password",
    }
    response = client.post(url, data)
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert 'non_field_errors' in response.json()
    assert 'Unable to log in with provided credentials.' in response.json()['non_field_errors']


@pytest.mark.django_db
def test_login_view_wrong_user(user):
    client = Client()
    url = reverse('user-login')
    data = {
        "username": "wrong user",
        "password": "test password",
    }
    response = client.post(url, data)
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert 'non_field_errors' in response.json()
    assert 'Unable to log in with provided credentials.' in response.json()['non_field_errors']
