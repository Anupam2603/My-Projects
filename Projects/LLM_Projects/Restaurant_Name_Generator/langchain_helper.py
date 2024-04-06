#Importing necessary libraries/modules
import os
from langchain_community.llms import HuggingFaceEndpoint
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from secret_key import secret_key
from langchain.chains import SequentialChain

#Saving api_key in environment variables
os.environ["HUGGINGFACEHUB_API_TOKEN"] = secret_key #Replace with appropriate api key from HuggingFaceHub

# Function to generate response from prompt
def generate_response(cuisine):

    # Creating Prompt Template
    restaurant_prompt = PromptTemplate(
                    input_variables = ['cuisine'],
                    template = "I want to open a restaurant in a city.Suggest some fency name for {cuisine} restaurant. Please write your answer only pointwise")

    items_prompt = PromptTemplate(
                        input_variables = ['restaurant_name'],
                        template = "Now please suggest some food items(breakfast, dinner and lunch) for {restaurant_name}")

    repo_id = "mistralai/Mistral-7B-Instruct-v0.2" # We can replace model with other availabel models!

    #Initializing our LLM model
    llm = HuggingFaceEndpoint(
        repo_id=repo_id, max_length=128, temperature=0.6, token=os.environ["HUGGINGFACEHUB_API_TOKEN"]
    )
    restaurant_chain = LLMChain(prompt=restaurant_prompt, llm=llm, output_key="restaurant_name")
    items_chain = LLMChain(prompt=items_prompt, llm=llm, output_key="food_items")

    #Creating a sequential chain to pass one prompt's result to another prompt!
    chain = SequentialChain(chains=[restaurant_chain, items_chain], 
                            input_variables=["cuisine"],
                            output_variables=["restaurant_name", "food_items"])
    
    response = chain({"cuisine": cuisine})
    return response
