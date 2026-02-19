def calculate_source_contribution(data):
    pm25 = data["PM2.5"]
    pm10 = data["PM10"]
    no2 = data["NO2"]
    so2 = data["SO2"]
    co = data["CO"]

    total = pm25 + pm10 + no2 + so2 + co

    if total == 0:
        return {}

    contribution = {
        "Dust": round((pm10 / total) * 100, 2),
        "Vehicles": round((no2 / total) * 100, 2),
        "Industry": round((so2 / total) * 100, 2),
        "Biomass Burning": round((co / total) * 100, 2),
        "Urban Mixed": round((pm25 / total) * 100, 2),
    }

    return contribution
