from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .serializers import GetRouteSerializer, MessageSerializer, InterpretSerializer
from .ai_helper import (
    select_route_from_message,
    generate_human_readable_message,
    medical_assist_advice
)

assist_route_list = [
 '/user/emergency',
 '/user/ambulance',
'/user/raiseBloodRequest'
]

navigate_route_list = []

@api_view(['POST'])
def get_route(request):
    serializer = GetRouteSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    message = serializer.validated_data['message']
    action = serializer.validated_data['action']
    
    try:
        selected_route = select_route_from_message(
            message=message,
            action=action,
            assist_routes=assist_route_list,
            navigate_routes=navigate_route_list
        )
        
        if selected_route is None:
            return Response(
                {'error': f'No routes available for action type: {action}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return Response({
            'message': message,
            'action': action,
            'selected_route': selected_route
        })
    
    except Exception as e:
        return Response(
            {'error': f'Failed to select route: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def interpret(request):
    serializer = InterpretSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    unformatted_data = serializer.validated_data['unformatted_data']
    
    try:
        readable_message = generate_human_readable_message(unformatted_data)
        return Response({
            'original_data': unformatted_data,
            'readable_message': readable_message
        })
    except Exception as e:
        return Response(
            {'error': f'Failed to interpret data: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def medical_assist(request):
    serializer = MessageSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user_message = serializer.validated_data['message']

    try:
        ai_advice = medical_assist_advice(user_message)
        return Response({
            'user_message': user_message,
            'recommendation': ai_advice
        })
    except Exception as e:
        return Response(
            {'error': f'Failed to generate advice: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def check_health(request):
    return Response({"message": "Django server is running!"})


