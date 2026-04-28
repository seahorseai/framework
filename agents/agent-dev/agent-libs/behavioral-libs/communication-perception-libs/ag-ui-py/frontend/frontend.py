import streamlit as st
import requests
import json

st.title("🧠 Streaming Agent Demo")

user_input = st.text_input("Ask the agent:", "Explain async streaming")

if st.button("Send"):
    placeholder = st.empty()
    full_response = ""

    # call backend with streaming enabled
    with requests.get(
        "http://localhost:8000/chat/stream",
        params={"message": user_input},
        stream=True
    ) as r:

        for line in r.iter_lines():
            if line:
                data = json.loads(line.decode("utf-8"))
                chunk = data["chunk"]

                full_response += chunk + "\n"

                # live update UI
                placeholder.markdown(full_response)