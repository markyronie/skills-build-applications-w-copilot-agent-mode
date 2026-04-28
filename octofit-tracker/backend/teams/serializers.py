from rest_framework import serializers
from .models import Team
from django.contrib.auth.models import User


class TeamSerializer(serializers.ModelSerializer):
    captain_name = serializers.CharField(source='captain.username', read_only=True)
    member_count = serializers.IntegerField(read_only=True)
    is_captain = serializers.SerializerMethodField()
    is_member = serializers.SerializerMethodField()

    class Meta:
        model = Team
        fields = ['id', 'name', 'description', 'captain', 'captain_name', 
                  'member_count', 'is_captain', 'is_member', 'created_at']
        read_only_fields = ['captain', 'created_at']

    def get_is_captain(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.captain == request.user
        return False

    def get_is_member(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.members.filter(id=request.user.id).exists()
        return False
