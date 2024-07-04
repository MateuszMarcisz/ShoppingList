from django.core.exceptions import ObjectDoesNotExist
from django.test import TestCase, Client
import pytest
from django.urls import reverse
from rest_framework import status

from ShoppingList.models import ShoppingList, Item


@pytest.mark.django_db
def test_shopping_list_get(shopping_lists, user):
    client = Client()
    client.force_login(user)
    url = reverse('shoppinglist-list-create')
    response = client.get(url)
    assert response.status_code == status.HTTP_200_OK
    # print(response.json())


@pytest.mark.django_db
def test_shopping_list_get_not_auth(shopping_lists):
    client = Client()
    url = reverse('shoppinglist-list-create')
    response = client.get(url)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
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
    assert response.status_code == status.HTTP_201_CREATED
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
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert ShoppingList.objects.count() == initial_count
    assert 'detail' in response.json()
    assert response.json().get('detail') == 'Authentication credentials were not provided.'
    # print(response.json())


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
    assert response.status_code == status.HTTP_400_BAD_REQUEST
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
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert ShoppingList.objects.count() == initial_count
    assert "This field is required." in response.json()['name']
    # print(response.json())


@pytest.mark.django_db
def test_shopping_list_detail_get(user, one_shopping_list):
    client = Client()
    client.force_login(user)
    url = reverse('shoppinglist-detail', kwargs={'pk': one_shopping_list.pk})
    response = client.get(url)
    assert response.status_code == status.HTTP_200_OK
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


@pytest.mark.django_db
def test_item_list_get(items, user):
    client = Client()
    client.force_login(user)
    url = reverse('item-list-create')
    response = client.get(url)
    assert response.status_code == status.HTTP_200_OK
    # print(response.json())


@pytest.mark.django_db
def test_item_list_get_no_auth(items, user):
    client = Client()
    url = reverse('item-list-create')
    response = client.get(url)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json().get('detail') == 'Authentication credentials were not provided.'
    # print(response.json())


@pytest.mark.django_db
def test_item_list_create(user, one_shopping_list):
    client = Client()
    client.force_login(user)
    url = reverse('item-list-create')
    data = {
        "name": "Brand New Item",
        "shopping_list": one_shopping_list.id,
        "quantity": 1,
    }
    initial_count = Item.objects.count()
    response = client.post(url, data)
    assert response.status_code == status.HTTP_201_CREATED
    assert Item.objects.count() == initial_count + 1
    # print(response.json())


@pytest.mark.django_db
def test_item_list_create_no_auth(user, one_shopping_list):
    client = Client()
    url = reverse('item-list-create')
    data = {
        "name": "Brand New Item",
        "shopping_list": one_shopping_list.id,
        "quantity": 1,
    }
    initial_count = Item.objects.count()
    response = client.post(url, data)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json().get('detail') == 'Authentication credentials were not provided.'
    assert Item.objects.count() == initial_count
    # print(response.json())


@pytest.mark.django_db
def test_item_list_create_no_auth_no_field_name(user, one_shopping_list):
    client = Client()
    client.force_login(user)
    url = reverse('item-list-create')
    data = {
        "shopping_list": one_shopping_list.id,
        "quantity": 1,
    }
    initial_count = Item.objects.count()
    response = client.post(url, data)
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert Item.objects.count() == initial_count
    assert "This field is required." in response.json()['name']
    # print(response.json())


@pytest.mark.django_db
def test_item_list_create_no_auth_no_field_shoppinglist(user, one_shopping_list):
    client = Client()
    client.force_login(user)
    url = reverse('item-list-create')
    data = {
        "name": "hehe",
        "quantity": 1,
    }
    initial_count = Item.objects.count()
    response = client.post(url, data)
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert Item.objects.count() == initial_count
    assert "This field is required." in response.json()['shopping_list']
    # print(response.json())


@pytest.mark.django_db
def test_item_detail_get(user, one_item):
    client = Client()
    client.force_login(user)
    url = reverse('item-detail', kwargs={'pk': one_item.pk})
    response = client.get(url)
    assert response.status_code == status.HTTP_200_OK
    # print(response.json())


@pytest.mark.django_db
def test_item_detail_get_no_auth(user, one_item):
    client = Client()
    url = reverse('item-detail', kwargs={'pk': one_item.pk})
    response = client.get(url)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert 'detail' in response.json()
    assert response.json().get('detail') == 'Authentication credentials were not provided.'
    # print(response.json())


@pytest.mark.django_db
def test_item_detail_get_wrong_id(user, one_item):
    client = Client()
    client.force_login(user)
    url = reverse('item-detail', kwargs={'pk': 2})
    response = client.get(url)
    assert response.status_code == status.HTTP_404_NOT_FOUND
    # print(response.json())


@pytest.mark.django_db
def test_item_detail_put_new_name(user, one_item, one_shopping_list):
    client = Client()
    client.force_login(user)
    url = reverse('item-detail', kwargs={'pk': one_item.pk})
    data = {
        "name": "New name",
        "shopping_list": one_shopping_list.id,
    }
    response = client.put(url, data, content_type='application/json')
    assert response.status_code == status.HTTP_200_OK
    response_data = response.json()
    assert response_data['name'] == data['name']
    assert response_data['name'] == 'New name'
    # print(response.json())


@pytest.mark.django_db
def test_item_detail_put_new_quantity(user, one_item, one_shopping_list):
    client = Client()
    client.force_login(user)
    url = reverse('item-detail', kwargs={'pk': one_item.pk})
    data = {
        "name": one_item.name,
        "quantity": 69,
        "shopping_list": one_shopping_list.id,
    }
    response = client.put(url, data, content_type='application/json')
    assert response.status_code == status.HTTP_200_OK
    response_data = response.json()
    assert response_data['quantity'] == data['quantity']
    assert response_data['quantity'] == 69
    # print(response.json())


@pytest.mark.django_db
def test_item_detail_put_new_status(user, one_item, one_shopping_list):
    client = Client()
    client.force_login(user)
    url = reverse('item-detail', kwargs={'pk': one_item.pk})
    data = {
        "name": one_item.name,
        "purchased": True,
        "shopping_list": one_shopping_list.id,
    }
    response = client.put(url, data, content_type='application/json')
    assert response.status_code == status.HTTP_200_OK
    response_data = response.json()
    assert response_data['purchased'] == data['purchased']
    assert response_data['purchased']
    # print(response.json())


@pytest.mark.django_db
def test_item_detail_put_no_auth(user, one_item, one_shopping_list):
    client = Client()
    url = reverse('item-detail', kwargs={'pk': one_item.pk})
    data = {
        "name": "New name",
        "shopping_list": one_shopping_list.id
    }
    response = client.put(url, data, content_type='application/json')
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert 'detail' in response.json()
    assert response.json().get('detail') == 'Authentication credentials were not provided.'
    # print(response.json())


@pytest.mark.django_db
def test_item_detail_put_wrong_id(user, one_item, one_shopping_list):
    client = Client()
    client.force_login(user)
    url = reverse('item-detail', kwargs={'pk': 2})
    data = {
        "name": "New name",
        "shopping_list": one_shopping_list.id
    }
    response = client.put(url, data, content_type='application/json')
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert one_item.name == 'test item'  # same as in the fixture


@pytest.mark.django_db
def test_item_detail_delete(user, one_item, one_shopping_list):
    client = Client()
    client.force_login(user)
    url = reverse('item-detail', kwargs={'pk': one_item.pk})
    initial_count = Item.objects.count()
    response = client.delete(url)
    assert response.status_code == status.HTTP_204_NO_CONTENT
    with pytest.raises(ObjectDoesNotExist):
        Item.objects.get(pk=one_item.pk)
    assert Item.objects.count() == initial_count - 1
    # print(response.json())


@pytest.mark.django_db
def test_item_detail_delete_no_auth(user, one_item, one_shopping_list):
    client = Client()
    url = reverse('item-detail', kwargs={'pk': one_item.pk})
    initial_count = Item.objects.count()
    response = client.delete(url)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert 'detail' in response.json()
    assert response.json().get('detail') == 'Authentication credentials were not provided.'
    assert Item.objects.count() == initial_count
    # print(response.json())


@pytest.mark.django_db
def test_item_detail_delete_wrong_id(user, one_item, one_shopping_list):
    client = Client()
    client.force_login(user)
    url = reverse('item-detail', kwargs={'pk': 2})
    initial_count = Item.objects.count()
    response = client.delete(url)
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert Item.objects.count() == initial_count
    # print(response.json())
