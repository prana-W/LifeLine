from rest_framework.decorators import api_view
from rest_framework.response import Response

from .serializers import GetRouteSerializer,MessageSerializer

@api_view(['POST'])
def get_route(request):
    serializer = GetRouteSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    return Response(serializer.data)

@api_view(['POST'])
def interpret(request):
    serializer = MessageSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    return Response(serializer.data)

@api_view(['POST'])
def medical_assist(request):
    serializer = MessageSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    return Response(serializer.data)
