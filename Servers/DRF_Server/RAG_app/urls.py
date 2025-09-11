from django.urls import path
from .views import BuildMemoryFromDirView, BuildMemoryFromUploadView, AskView

urlpatterns = [
    path("rag/build-from-dir/", BuildMemoryFromDirView.as_view(), name="rag_build_from_dir"),
    path("rag/build-from-upload/", BuildMemoryFromUploadView.as_view(), name="rag_build_from_upload"),
    path("rag/ask/", AskView.as_view(), name="rag_ask"),
]



"""
# Run on postman ------------
http://127.0.0.1:8000/RAG_api/rag/build-from-dir/
{
    "data_path": "data"
}

# upload pdf file 📃📃
http://127.0.0.1:8000/RAG_api/rag/build-from-upload/
Go to the option of form data , then select
key --> files
value -->> select pdf path


# Ask Questions from Ai : 🤖🤖
http://127.0.0.1:8000/RAG_api/rag/ask/
{
    "question": "What scholarships cover tuition for STEM students?"
} 

"""