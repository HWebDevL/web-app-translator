from flask import Flask, request, render_template, jsonify

import requests

app = Flask(__name__)



url = "https://free-google-translator.p.rapidapi.com/external-api/free-google-translator"


headers = {
	"x-rapidapi-key": "77a92e2df3msha67fe6d19266125p110a17jsn4520546fe8b2",
	"x-rapidapi-host": "free-google-translator.p.rapidapi.com",
	"Content-Type": "application/json"
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
    response = requests.post(url, json=payload, headers=headers, params=querystring)
    translated_text = response.json()["translation"]
    return jsonify({"translated_text": translated_text})



if __name__ == "__main__":
    app.run()