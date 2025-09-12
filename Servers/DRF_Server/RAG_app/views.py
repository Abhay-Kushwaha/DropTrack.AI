import os
from pathlib import Path
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser

from .serializers import AskSerializer, BuildFromDirSerializer, BuildFromUploadSerializer
from . import services

class BuildMemoryFromDirView(APIView):
    """
    POST body (json):
    {
      "data_path": "data"   # optional; defaults to env RAG_DATA_PATH or ./data
    }
    """
    def post(self, request):
        ser = BuildFromDirSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        data_path = ser.validated_data.get("data_path") or os.environ.get("RAG_DATA_PATH", "data")

        try:
            stats = services.build_vectorstore_from_dir(data_path)
            return Response({"ok": True, "message": "Vectorstore built", "stats": stats}, status=200)
        except Exception as e:
            return Response({"ok": False, "error": str(e)}, status=500)


class BuildMemoryFromUploadView(APIView):
    """
    Multipart form-data with one or more PDF files under "files"
    """
    # parser_classes = []  # let DRF default parsers handle; you can add MultiPartParser if needed
    parser_classes = (MultiPartParser, FormParser)
    
    def post(self, request):
        files = request.FILES.getlist("files")
        ser = BuildFromUploadSerializer(data={"files": files})
        ser.is_valid(raise_exception=True)

        saved_paths = []
        try:
            from pathlib import Path
            tmp_dir = Path(".rag_tmp")
            tmp_dir.mkdir(parents=True, exist_ok=True)

            for f in files:
                p = tmp_dir / f.name
                with open(p, "wb") as out:
                    for chunk in f.chunks():
                        out.write(chunk)
                saved_paths.append(str(p))

            from . import services
            stats = services.build_vectorstore_from_uploaded_files(saved_paths)
            return Response({"ok": True, "message": "Vectorstore built from uploads", "stats": stats}, status=200)
        except Exception as e:
            return Response({"ok": False, "error": str(e)}, status=500)
        finally:
            for p in saved_paths:
                try:
                    Path(p).unlink(missing_ok=True)
                except Exception:
                    pass

class AskView(APIView):
    """
    POST body (json):
    {
      "question": "your question here"
    }
    """
    def post(self, request):
        ser = AskSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        q = ser.validated_data["question"]

        try:
            result = services.answer_question(q, k=3)
            return Response({"ok": True, **result}, status=200)
        except Exception as e:
            return Response({"ok": False, "error": str(e)}, status=500)
