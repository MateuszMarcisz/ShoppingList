from django.core.exceptions import ObjectDoesNotExist
from django.test import TestCase, Client
import pytest
from django.urls import reverse
from rest_framework import status

from ShoppingList.models import ShoppingList


@pytest.mark.django_db
def test_shopping_list_get(shopping_lists, user):
    client = Client()
    client.force_login(user)
    url = reverse('shoppinglist-list-create')
    response = client.get(url)
    assert response.status_code == 200
    # print(response.json())


@pytest.mark.django_db
def test_shopping_list_get_not_auth(shopping_lists):
    client = Client()
    url = reverse('shoppinglist-list-create')
    response = client.get(url)
    assert response.status_code == 401
    # print(response.json())
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
    # print(response.json())


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
    # print(response.json())


@pytest.mark.django_db
def test_shopping_list_create_empty_required_field_name(user):
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
    # print(response.json())


@pytest.mark.django_db
def test_shopping_list_detail_get(user, one_shopping_list):
    client = Client()
    client.force_login(user)
    url = reverse('shoppinglist-detail', kwargs={'pk': one_shopping_list.pk})
    response = client.get(url)
    assert response.status_code == 200
    assert response.status_code == status.HTTP_200_OK  # can be also done like this
    # print(response.json())


@pytest.mark.django_db
def test_shopping_list_detail_get_no_auth(user, one_shopping_list):
    client = Client()
    url = reverse('shoppinglist-detail', kwargs={'pk': one_shopping_list.pk})
    response = client.get(url)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert 'detail' in response.json()
    assert response.json().get('detail') == 'Authentication credentials were not provided.'
    # print(response.json())


@pytest.mark.django_db
def test_shopping_list_detail_get_wrong_id(user, one_shopping_list):
    client = Client()
    client.force_login(user)
    url = reverse('shoppinglist-detail', kwargs={'pk': 2})
    response = client.get(url)
    assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.django_db
def test_shopping_list_detail_put(user, one_shopping_list):
    client = Client()
    client.force_login(user)
    url = reverse('shoppinglist-detail', kwargs={'pk': one_shopping_list.pk})
    data = {
        "name": "New name",
        "user": user.id
    }
    response = client.put(url, data, content_type='application/json')
    assert response.status_code == status.HTTP_200_OK
    response_data = response.json()
    assert response_data['name'] == data['name']
    assert response_data['name'] == 'New name'
    # print(response.json())


@pytest.mark.django_db
def test_shopping_list_detail_put_no_auth(user, one_shopping_list):
    client = Client()
    url = reverse('shoppinglist-detail', kwargs={'pk': one_shopping_list.pk})
    data = {
        "name": "New name",
        "user": user.id
    }
    response = client.put(url, data, content_type='application/json')
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert 'detail' in response.json()
    assert response.json().get('detail') == 'Authentication credentials were not provided.'
    # print(response.json())


@pytest.mark.django_db
def test_shopping_list_detail_put_wrong_id(user, one_shopping_list):
    client = Client()
    client.force_login(user)
    url = reverse('shoppinglist-detail', kwargs={'pk': 2})
    data = {
        "name": "New name",
        "user": user.id
    }
    response = client.put(url, data, content_type='application/json')
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert one_shopping_list.name == 'testing list'  # same as in the fixture


@pytest.mark.django_db
def test_shopping_list_detail_delete(user, one_shopping_list):
    client = Client()
    client.force_login(user)
    url = reverse('shoppinglist-detail', kwargs={'pk': one_shopping_list.pk})
    initial_count = ShoppingList.objects.count()
    response = client.delete(url)
    assert response.status_code == status.HTTP_204_NO_CONTENT
    with pytest.raises(ObjectDoesNotExist):
        ShoppingList.objects.get(pk=one_shopping_list.pk)
    assert ShoppingList.objects.count() == initial_count - 1
    # print(response.json())


@pytest.mark.django_db
def test_shopping_list_detail_delete_no_auth(user, one_shopping_list):
    client = Client()
    url = reverse('shoppinglist-detail', kwargs={'pk': one_shopping_list.pk})
    initial_count = ShoppingList.objects.count()
    response = client.delete(url)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert 'detail' in response.json()
    assert response.json().get('detail') == 'Authentication credentials were not provided.'
    assert ShoppingList.objects.count() == initial_count
    # print(response.json())


@pytest.mark.django_db
def test_shopping_list_detail_delete_wrong_id(user, one_shopping_list):
    client = Client()
    client.force_login(user)
    url = reverse('shoppinglist-detail', kwargs={'pk': 2})
    initial_count = ShoppingList.objects.count()
    response = client.delete(url)
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert ShoppingList.objects.count() == initial_count
    # print(response.json())
