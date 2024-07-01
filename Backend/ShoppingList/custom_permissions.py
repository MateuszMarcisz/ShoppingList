from rest_framework import permissions

from ShoppingList.models import ShoppingList, Item


# Permission to only allow owners of an object to view or edit it.
class IsOwner(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        # Object-level permission to only allow owners of the object to view/edit it.
        # return obj.user == request.user

        # If the object is a ShoppingList, check if the user is the owner.
        if isinstance(obj, ShoppingList):
            return obj.user == request.user
        # If the object is an Item, check if the user is the owner of the related ShoppingList.
        elif isinstance(obj, Item):
            return obj.shopping_list.user == request.user
        return False
