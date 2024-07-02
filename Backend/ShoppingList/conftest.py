import pytest
from django.contrib.auth.models import User

from ShoppingList.models import ShoppingList


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

