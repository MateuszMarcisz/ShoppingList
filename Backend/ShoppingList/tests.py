from django.test import TestCase, Client
import pytest
from django.urls import reverse

from ShoppingList.models import ShoppingList


@pytest.mark.django_db
def test_shopping_list_get(shopping_lists, user):
    client = Client()
    client.force_login(user)
    url = reverse('shoppinglist-list-create')
    response = client.get(url)
    assert response.status_code == 200
    print(response.json())


@pytest.mark.django_db
def test_shopping_list_get_not_auth(shopping_lists):
    client = Client()
    url = reverse('shoppinglist-list-create')
    response = client.get(url)
    assert response.status_code == 401
    print(response.json())
    assert 'detail' in response.json()
    assert response.json().get('detail') == 'Authentication credentials were not provided.'


@pytest.mark.django_db
def test_shopping_list_create(user):
    client = Client()
    client.force_login(user)
    url = reverse('shoppinglist-list-create')
    data = {
        "name": "Create test",
        "user": user.id
    }
    initial_count = ShoppingList.objects.count()
    response = client.post(url, data)
    assert response.status_code == 201
    assert ShoppingList.objects.count() == initial_count + 1
    print(response.json())


@pytest.mark.django_db
def test_shopping_list_create_not_auth(user):
    client = Client()
    url = reverse('shoppinglist-list-create')
    data = {
        "name": "Create test",
        "user": user.id
    }
    initial_count = ShoppingList.objects.count()
    response = client.post(url, data)
    assert response.status_code == 401
    assert ShoppingList.objects.count() == initial_count
    assert 'detail' in response.json()
    assert response.json().get('detail') == 'Authentication credentials were not provided.'


@pytest.mark.django_db
def test_shopping_list_create_empty_required_field_user(user):
    client = Client()
    client.force_login(user)
    url = reverse('shoppinglist-list-create')
    data = {
        "name": "Create test",
    }
    initial_count = ShoppingList.objects.count()
    response = client.post(url, data)
    assert response.status_code == 400
    assert ShoppingList.objects.count() == initial_count
    assert "This field is required." in response.json()['user']
    print(response.json())


@pytest.mark.django_db
def test_shopping_list_create_empty_required_field_user(user):
    client = Client()
    client.force_login(user)
    url = reverse('shoppinglist-list-create')
    data = {
        "user": user.id
    }
    initial_count = ShoppingList.objects.count()
    response = client.post(url, data)
    assert response.status_code == 400
    assert ShoppingList.objects.count() == initial_count
    assert "This field is required." in response.json()['name']
    print(response.json())
