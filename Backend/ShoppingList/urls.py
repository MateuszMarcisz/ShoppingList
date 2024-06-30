from django.urls import path
from .views import (
    ShoppingListListCreateAPIView,
    ShoppingListRetrieveUpdateDestroyAPIView,
    ItemListCreateAPIView,
    ItemRetrieveUpdateDestroyAPIView
)

urlpatterns = [
    path('shoppinglists/', ShoppingListListCreateAPIView.as_view(), name='shoppinglist-list-create'),
    path('shoppinglists/<int:pk>/', ShoppingListRetrieveUpdateDestroyAPIView.as_view(), name='shoppinglist-detail'),
    path('items/', ItemListCreateAPIView.as_view(), name='item-list-create'),
    path('items/<int:pk>/', ItemRetrieveUpdateDestroyAPIView.as_view(), name='item-detail'),
]

