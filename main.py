from flask import Flask, request, render_template, jsonify
import os
from dotenv import load_dotenv
import requests

app = Flask(__name__)

load_dotenv()

RAPID_API_KEY = os.getenv("RAPID_API_KEY")
RAPID_API_HOST = os.getenv("RAPID_API_HOST")
CONTENT_TYPE = os.getenv("CONTENT_TYPE")
URL = os.getenv("URL")

headers = {
    "x-rapidapi-key": RAPID_API_KEY,
    "x-rapidapi-host": RAPID_API_HOST,
    "Content-Type": CONTENT_TYPE
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
    try:
        response = requests.post(URL, json=payload, headers=headers, params=querystring, timeout=5)
        response.raise_for_status() 
        json_data = response.json()
        translated_text = json_data["translation"]
        if not translated_text:
            raise ValueError("Translation not found in API response")
    except Exception as e:
        translated_text = f"Error: {str(e)}"

    return jsonify({"translated_text": translated_text})



if __name__ == "__main__":
    app.run()

