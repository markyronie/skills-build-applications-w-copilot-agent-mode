from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Team
from .serializers import TeamSerializer


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        # Set the current user as captain
        team = serializer.save(captain=self.request.user)
        # Automatically add captain as a member
        team.members.add(self.request.user)

    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        """Allow a user to join a team"""
        team = self.get_object()
        if request.user in team.members.all():
            return Response(
                {'detail': 'You are already a member of this team.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        team.members.add(request.user)
        return Response(
            {'detail': f'Successfully joined {team.name}!'},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'])
    def leave(self, request, pk=None):
        """Allow a user to leave a team"""
        team = self.get_object()
        if team.captain == request.user:
            return Response(
                {'detail': 'Captain cannot leave the team. Transfer captaincy first or delete the team.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        if request.user not in team.members.all():
            return Response(
                {'detail': 'You are not a member of this team.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        team.members.remove(request.user)
        return Response(
            {'detail': f'Successfully left {team.name}.'},
            status=status.HTTP_200_OK
        )
