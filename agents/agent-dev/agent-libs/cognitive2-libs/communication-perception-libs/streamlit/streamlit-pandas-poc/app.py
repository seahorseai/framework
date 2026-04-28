import streamlit as st
import pandas as pd

st.title("Pandas + Streamlit Demo")

data = {
    "Name": ["Alice", "Bob", "Charlie"],
    "Age": [25, 30, 35]
}

df = pd.DataFrame(data)

st.write(df)
