def generate_recommendations(aqi, sources):

    recommendations = []

    if aqi > 300:
        recommendations.append("Declare public health emergency")
        recommendations.append("Close schools temporarily")

    if sources.get("Dust", 0) > 30:
        recommendations.append("Increase water sprinkling on roads")
        recommendations.append("Control construction activities")

    if sources.get("Vehicles", 0) > 30:
        recommendations.append("Implement odd-even vehicle rule")
        recommendations.append("Increase public transport availability")

    if sources.get("Industry", 0) > 25:
        recommendations.append("Inspect industrial emissions")
        recommendations.append("Temporary shutdown of non-compliant units")

    if sources.get("Biomass Burning", 0) > 20:
        recommendations.append("Control stubble burning activities")

    return recommendations
