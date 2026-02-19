from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt
)

import os
import requests
from dotenv import load_dotenv

# -----------------------
# Load Environment
# -----------------------
load_dotenv()
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")

# -----------------------
# App Setup
# -----------------------
app = Flask(__name__)
CORS(app)

app.config["JWT_SECRET_KEY"] = "super-secret-key"
jwt = JWTManager(app)

# -----------------------
# Dummy Users
# -----------------------
users = {
    "analyst@cpcb.gov.in": {"password": "123456", "role": "analyst"},
    "policy@cpcb.gov.in": {"password": "123456", "role": "policymaker"},
    "field@cpcb.gov.in": {"password": "123456", "role": "fieldofficer"},
}

# -----------------------
# LOGIN
# -----------------------
@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = users.get(email)

    if not user or user["password"] != password:
        return jsonify({"message": "Invalid credentials"}), 401

    access_token = create_access_token(
        identity=email,
        additional_claims={"role": user["role"]}
    )

    return jsonify({
        "token": access_token,
        "role": user["role"]
    })

# -----------------------
# LIVE AQI
# -----------------------
@app.route("/api/live-aqi", methods=["GET"])
@jwt_required()
def live_aqi():

    lat = request.args.get("lat", 28.6139)
    lon = request.args.get("lon", 77.2090)

    if not OPENWEATHER_API_KEY:
        return jsonify({"error": "API key not configured"}), 500

    url = f"https://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}"

    try:
        response = requests.get(url, timeout=5)

        if response.status_code != 200:
            return jsonify({
                "status": "error",
                "message": "OpenWeather API error"
            }), 500

        data = response.json()

        pollution = data["list"][0]
        aqi_scale = pollution["main"]["aqi"]
        components = pollution["components"]

        # Convert OpenWeather 1–5 scale to readable band
        aqi_mapping = {
            1: {"value": 50, "level": "Good"},
            2: {"value": 100, "level": "Moderate"},
            3: {"value": 200, "level": "Unhealthy"},
            4: {"value": 300, "level": "Very Unhealthy"},
            5: {"value": 400, "level": "Severe"}
        }

        mapped = aqi_mapping.get(aqi_scale, {"value": 100, "level": "Unknown"})

        return jsonify({
            "status": "success",
            "location": {
                "lat": lat,
                "lon": lon
            },
            "aqi": {
                "value": mapped["value"],
                "category": mapped["level"]
            },
            "pollutants": {
                "PM25": components.get("pm2_5", 0),
                "PM10": components.get("pm10", 0),
                "NO2": components.get("no2", 0),
                "SO2": components.get("so2", 0),
                "CO": round(components.get("co", 0) / 1000, 2),
                "O3": components.get("o3", 0)
            },
            "timestamp": pollution["dt"]
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


# -----------------------
# RUN
# -----------------------
if __name__ == "__main__":
    app.run(debug=True)
