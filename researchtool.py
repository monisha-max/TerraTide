# import os
# from langchain_openai import OpenAI as OpenAILLM
# from langchain_openai import OpenAIEmbeddings as LLMEmbeddings 
# from langchain.chains import RetrievalQAWithSourcesChain as QAChain
# from langchain.text_splitter import RecursiveCharacterTextSplitter as TextSplitter
# from langchain_community.document_loaders import UnstructuredURLLoader as URLDataLoader
# from langchain_community.vectorstores import FAISS as FaissIndex
# from dotenv import load_dotenv
# import streamlit as st

# load_dotenv()

# openai_api_key = os.getenv('OPENAI_API_KEY')

# # Define the functions to process URLs and handle queries
# def process_urls(urls):
#     llm_embeddings = LLMEmbeddings(api_key=openai_api_key)
#     url_loader = URLDataLoader(urls=urls)
#     loaded_data = url_loader.load()

#     split_documents = split_text(loaded_data)

#     vectorindex_openai = FaissIndex.from_documents(split_documents, llm_embeddings)
#     vectorindex_openai.save_local("faiss_store")
#     st.success("URLs processed and FAISS index saved successfully!")

# def handle_query(user_query):
#     language_model = OpenAILLM(api_key=openai_api_key)
#     llm_embeddings = LLMEmbeddings(api_key=openai_api_key)
    
#     if os.path.isdir("faiss_store"):
#         loaded_faiss_index = FaissIndex.load_local("faiss_store", llm_embeddings, allow_dangerous_deserialization=True)
#         qa_chain = QAChain.from_llm(llm=language_model, retriever=loaded_faiss_index.as_retriever())
#         query_result = qa_chain({"question": user_query}, return_only_outputs=True)
#         return query_result
#     else:
#         st.error("FAISS index not found. Please process the URLs first.")
#         return None

# def split_text(loaded_data):
#     primary_delimiters = ['\n\n', '\n', '.', ',']
#     fallback_delimiters = [';', ' ', '|']

#     doc_splitter = TextSplitter(separators=primary_delimiters, chunk_size=1000)
#     split_documents = doc_splitter.split_documents(loaded_data)

#     if not split_documents or len(split_documents) < 10:
#         doc_splitter = TextSplitter(separators=fallback_delimiters, chunk_size=1000)
#         split_documents = doc_splitter.split_documents(loaded_data)

#     return split_documents

# # Streamlit interface
# st.title("Research Tool")

# urls = st.text_area("Enter URLs (comma-separated):")
# if st.button("Process URLs"):
#     if urls:
#         urls_list = [url.strip() for url in urls.split(",")]
#         process_urls(urls_list)
#     else:
#         st.error("Please enter at least one URL.")

# query = st.text_input("Enter your query:")
# if st.button("Ask Query"):
#     if query:
#         result = handle_query(query)
#         if result:
#             st.write("Result:", result)
#     else:
#         st.error("Please enter a query.")
import os
import openai
from langchain.embeddings.openai import OpenAIEmbeddings as LLMEmbeddings
from langchain.chains import RetrievalQAWithSourcesChain as QAChain
from langchain.text_splitter import RecursiveCharacterTextSplitter as TextSplitter
from langchain_community.document_loaders import UnstructuredURLLoader as URLDataLoader
from langchain_community.vectorstores import FAISS as FaissIndex
from dotenv import load_dotenv
import streamlit as st

load_dotenv()

openai_api_key = os.getenv('OPENAI_API_KEY')

# Function to check if the API key is valid
def check_api_key(api_key):
    try:
        openai.api_key = api_key
        openai.Model.list()  # Simple API call to check the key
        return True
    except openai.error.AuthenticationError:
        return False

# Define the functions to process URLs and handle queries
def process_urls(urls):
    if not check_api_key(openai_api_key):
        st.error("Invalid or expired OpenAI API key. Please update the key.")
        return
    
    llm_embeddings = LLMEmbeddings(openai_api_key=openai_api_key)
    url_loader = URLDataLoader(urls=urls)
    loaded_data = url_loader.load()

    split_documents = split_text(loaded_data)

    vectorindex_openai = FaissIndex.from_documents(split_documents, llm_embeddings)
    vectorindex_openai.save_local("faiss_store")
    st.success("URLs processed and FAISS index saved successfully!")

def handle_query(user_query):
    if not check_api_key(openai_api_key):
        st.error("Invalid or expired OpenAI API key. Please update the key.")
        return None
    
    language_model = LLMEmbeddings(api_key=openai_api_key)
    
    if os.path.isdir("faiss_store"):
        loaded_faiss_index = FaissIndex.load_local("faiss_store", language_model, allow_dangerous_deserialization=True)
        qa_chain = QAChain.from_llm(llm=language_model, retriever=loaded_faiss_index.as_retriever())
        query_result = qa_chain({"question": user_query}, return_only_outputs=True)
        return query_result
    else:
        st.error("FAISS index not found. Please process the URLs first.")
        return None

def split_text(loaded_data):
    primary_delimiters = ['\n\n', '\n', '.', ',']
    fallback_delimiters = [';', ' ', '|']

    doc_splitter = TextSplitter(separators=primary_delimiters, chunk_size=1000)
    split_documents = doc_splitter.split_documents(loaded_data)

    if not split_documents or len(split_documents) < 10:
        doc_splitter = TextSplitter(separators=fallback_delimiters, chunk_size=1000)
        split_documents = doc_splitter.split_documents(loaded_data)

    return split_documents

# Streamlit interface
st.title("Research Tool")

urls = st.text_area("Enter URLs (comma-separated):")
if st.button("Process URLs"):
    if urls:
        urls_list = [url.strip() for url in urls.split(",")]
        process_urls(urls_list)
    else:
        st.error("Please enter at least one URL.")

query = st.text_input("Enter your query:")
if st.button("Ask Query"):
    if query:
        result = handle_query(query)
        if result:
            st.write("Result:", result)
    else:
        st.error("Please enter a query.")
