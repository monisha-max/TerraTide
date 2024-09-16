#Import Libraries
import openai
import gradio as gr

#the API key for accessing OpenAI's services is set
openai.api_key = "replace with ur open ai key"

#Initializes a list with a system-generated message introducing the 'IntelliTax' assistant.
messages = [{"role": "system", "content": "assistant of agroapp"}]

#This function defines the behavior for handling user input and generating a response using the GPT model.
def CustomChatGPT(user_input):
    messages.append({"role": "user", "content": user_input})
    response = openai.ChatCompletion.create(
        #specifying the model to use
        model="gpt-3.5-turbo",
        messages=messages
    )
    ChatGPT_reply = response["choices"][0]["message"]["content"]
    messages.append({"role": "assistant", "content": ChatGPT_reply})
    return ChatGPT_reply

css = """
body, html {
    height: 100%;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #E1AFD1; /* A deep blue shade */
}

body {
    font-family: 'Arial', sans-serif;
    color: #ffffff;
    text-align: center;
}

.gradio_container {
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
    background-color: #AD88C6; /* A light background for the content */
    border-radius: 15px;
    overflow: hidden; /* Ensures the child elements do not overflow the rounded corners */
    margin: 20px;
    transition: transform 0.3s ease;
}

.gradio_container:hover {
    transform: translateY(-5px); /* A subtle hover effect */
}

.gradio_content {
    padding: 2rem; /* More padding for better spacing */
}

.input_text, .output_text, textarea, label, button {
    font-size: 1rem;
    border-radius: 5px;
    border: 2px solid #0b3d91;
    padding: 0.5rem;
    margin-top: 0.5rem; /* Uniform spacing from the top */
}

.output_text, label {
    color: #1b2948;
    font-weight: bold;
}

button {
    background-color: #0b3d91;
    color: white;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s;
}

button:hover {
    background-color: #1c1d67;
}

.title, .description {
    margin-bottom: 2rem; /* More spacing above the title and description */
}

.title {
    font-size: 2rem;
    color: #333333;
}

.description {
    font-size: 1.2rem;
    color: #555555;
}

"""
# Creating a gradio Interface. This sets up the UI for the application.
demo = gr.Interface(
    fn=CustomChatGPT, # The function to be called when the user submits input. 'CustomChatGPT' should be a function defined elsewhere in your code that handles the user's query.
    inputs=gr.Textbox(lines=2, placeholder="Type your question here..."),
    outputs="text", # Specifies that the output will be text. This is what the 'CustomChatGPT' function will return as its response.
    title="Agroapp Assistant",  # The title of the web interface, which will be displayed at the top of the page.
    description="This is an AI-powered tax assistant. Feel free to ask any agro-related questions!",# A brief description of the application
    css=css
    
)
# Launches the Gradio interface
demo.launch(share=True)
