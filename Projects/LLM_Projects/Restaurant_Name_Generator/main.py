#Importing necessary libraries/modules
import streamlit as st
from langchain_helper import *

# Creating a streamlit app
st.title("Restaurant Name Generator")

cuisine =  st.sidebar.selectbox("Pick a Cuisine", ("Indian", "Mexican", "Chinese", "Italian", "Japanees"))


if cuisine:
    #If cuisine is non-empty generating the response accordingly.
    response = generate_response(cuisine)
    st.header("Restaurant Names:")
    st.write(response['restaurant_name'])
    menu_items = response["food_items"]
    st.header("Menu Items:")
    st.write(menu_items)
else:
    st.header("Please select a Cuisine!")