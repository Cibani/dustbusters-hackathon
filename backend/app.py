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
# AQI Calculation (Indian PM2.5 based)
# -----------------------

def calculate_aqi_pm25(pm25):
    if pm25 <= 30:
        return 50
    elif pm25 <= 60:
        return 100
    elif pm25 <= 90:
        return 150
    elif pm25 <= 120:
        return 200
    elif pm25 <= 250:
        return 300
    else:
        return 400


def determine_category(aqi):
    if aqi <= 50:
        return "Good"
    elif aqi <= 100:
        return "Satisfactory"
    elif aqi <= 200:
        return "Moderate"
    elif aqi <= 300:
        return "Poor"
    elif aqi <= 400:
        return "Very Poor"
    else:
        return "Severe"

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
        response = requests.get(url, timeout=10)

        if response.status_code != 200:
            return jsonify({
                "status": "error",
                "message": "OpenWeather API error"
            }), 500

        data = response.json()
        pollution = data["list"][0]
        components = pollution["components"]

        pm25 = components.get("pm2_5", 0)

        aqi_value = calculate_aqi_pm25(pm25)
        category = determine_category(aqi_value)

        return jsonify({
            "status": "success",
            "location": {
                "lat": lat,
                "lon": lon
            },
            "aqi": {
                "value": aqi_value,
                "category": category
            },
            "pollutants": {
                "PM25": pm25,
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
# FORECAST
# -----------------------
@app.route("/api/forecast", methods=["GET"])
@jwt_required()
def forecast():

    lat = request.args.get("lat", 28.6139)
    lon = request.args.get("lon", 77.2090)

    if not OPENWEATHER_API_KEY:
        return jsonify({"error": "API key not configured"}), 500

    url = f"https://api.openweathermap.org/data/2.5/air_pollution/forecast?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}"

    try:
        response = requests.get(url, timeout=10)

        if response.status_code != 200:
            return jsonify({
                "status": "error",
                "message": "Forecast API error"
            }), 500

        data = response.json()

        forecast_list = []

        for entry in data["list"][:8]:  # next 24 hours
            components = entry["components"]
            pm25 = components.get("pm2_5", 0)

            forecast_list.append({
                "timestamp": entry["dt"],
                "pm25": pm25,
                "pm10": components.get("pm10", 0),
                "no2": components.get("no2", 0),
                "aqi_value": calculate_aqi_pm25(pm25),
                "category": determine_category(calculate_aqi_pm25(pm25))
            })

        return jsonify({
            "status": "success",
            "forecast": forecast_list
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
