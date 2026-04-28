import streamlit as st
import requests

API_URL = "http://127.0.0.1:8000/items/"

st.title("FastAPI + Streamlit CRUD")

# Create
st.header("Create")
name = st.text_input("Name")
desc = st.text_area("Description")

if st.button("Create"):
    requests.post(API_URL, json={"name": name, "description": desc})

# Read
st.header("Items")
res = requests.get(API_URL)

if res.status_code == 200:
    for item in res.json():
        st.write(item)

# Update
st.header("Update")
uid = st.number_input("ID to update", step=1)
new_name = st.text_input("New name")

if st.button("Update"):
    requests.put(f"{API_URL}{uid}", json={"name": new_name, "description": ""})

# Delete
st.header("Delete")
did = st.number_input("ID to delete", step=1)

if st.button("Delete"):
    requests.delete(f"{API_URL}{did}")