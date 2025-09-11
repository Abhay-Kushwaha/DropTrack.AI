from rest_framework import serializers

class MessageSerializer(serializers.Serializer):
    # Accept both "message" and the misspelled "mesage"
    message = serializers.CharField(required=False, allow_blank=False)
    mesage = serializers.CharField(required=False, allow_blank=False)

    def validate(self, attrs):
        msg = attrs.get('message') or attrs.get('mesage')
        if not msg or not str(msg).strip():
            raise serializers.ValidationError({"message": "Provide non-empty 'message' (or 'mesage')."})
        attrs['message'] = str(msg).strip()
        return attrs
