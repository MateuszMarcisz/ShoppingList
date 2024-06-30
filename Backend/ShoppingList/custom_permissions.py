from rest_framework import permissions


# Permission to only allow owners of an object to view or edit it.
class IsOwner(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        # Object-level permission to only allow owners of the object to view/edit it.
        return obj.user == request.user


