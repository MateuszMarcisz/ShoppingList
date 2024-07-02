import pytest
from django.contrib.auth.models import User

from ShoppingList.models import ShoppingList, Item


@pytest.fixture
def user():
    return User.objects.create_user(
        username='test user',
        password='test password',
        email='test@example.com'
    )


@pytest.fixture
def shopping_lists(user):
    lst = []
    for i in range(10):
        lst.append(ShoppingList.objects.create(
            name=f'list{i}',
            user=user
        ))
    return lst


@pytest.fixture
def one_shopping_list(user):
    return ShoppingList.objects.create(
            name='testing list',
            user=user
        )


@pytest.fixture
def items(one_shopping_list):
    lst = []
    for i in range(10):
        lst.append(Item.objects.create(
            name=f'item {i}',
            shopping_list=one_shopping_list,
            quantity=i
        ))
    return lst


@pytest.fixture
def one_item(one_shopping_list):
    return Item.objects.create(
        name='test item',
        shopping_list=one_shopping_list,
        quantity=2
    )
