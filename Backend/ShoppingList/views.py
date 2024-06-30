from django.shortcuts import render
from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied

from ShoppingList.custom_permissions import IsOwner
from ShoppingList.models import ShoppingList, Item
from ShoppingList.serializers import ShoppingListSerializer, ItemSerializer


class ShoppingListListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = ShoppingListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ShoppingList.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ShoppingListRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ShoppingListSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return ShoppingList.objects.filter(user=self.request.user)


class ItemListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = ItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Item.objects.filter(shopping_list__user=self.request.user)

    def perform_create(self, serializer):
        shopping_list = serializer.validated_data['shopping_list']
        if shopping_list.user != self.request.user:
            raise PermissionDenied("You do not have permission to add items to this shopping list.")
        serializer.save()


class ItemRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ItemSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return Item.objects.filter(shopping_list__user=self.request.user)
