from rest_framework import serializers

class AskSerializer(serializers.Serializer):
    question = serializers.CharField()

class BuildFromDirSerializer(serializers.Serializer):
    data_path = serializers.CharField(required=False, allow_blank=True)

class BuildFromUploadSerializer(serializers.Serializer):
    # multiple PDF files
    files = serializers.ListField(
        child=serializers.FileField(allow_empty_file=False),
        allow_empty=False
    )
