from rest_framework import serializers

class GetRouteSerializer(serializers.Serializer):

    def validate(self,data):
        if data['action'] not in ['NV','AS']:
            raise serializers.ValidationError('Invalid action')
        return data

    message = serializers.CharField(max_length=2000)
    action = serializers.CharField(max_length=3,default='NV')

class MessageSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=20000)

class InterpretSerializer(serializers.Serializer):
    unformatted_data = serializers.JSONField()