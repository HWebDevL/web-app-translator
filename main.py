import os
from dotenv import load_dotenv
from flask import Flask, request, render_template, jsonify
import requests

load_dotenv() 

app = Flask(__name__)


URL = os.getenv("URL")
headers = {
    "x-rapidapi-key": os.getenv("RAPID_API_KEY"),
    "x-rapidapi-host": os.getenv("RAPID_API_HOST"),
    "Content-Type": os.getenv("CONTENT_TYPE")
}

@app.route("/")
def home():
    return render_template("translate.html")

@app.route("/translate", methods= ["POST"])
def translate():
    data = request.get_json()
    querystring = {
        "from": data.get("from"),
        "to": data.get("to"),
        "query": data.get("text")
    }
    payload = {"translate": "rapidapi"}
    response = requests.post(URL, json=payload, headers=headers, params=querystring)
    translated_text = response.json().get("translation", "")
    return jsonify({"translated_text": translated_text})



if __name__ == "__main__":

    app.run()


