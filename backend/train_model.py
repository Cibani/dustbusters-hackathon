import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
import joblib

# Load dataset
df = pd.read_csv("../dataset/Delhi_AQI_Dataset.csv")

# Drop unnecessary columns
df = df.drop(columns=["City", "Date", "Unnamed: 9", "Unnamed: 10"])

# Drop missing values
df = df.dropna()

# Features and target
X = df.drop("AQI", axis=1)
y = df["AQI"]

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
model = RandomForestRegressor()
model.fit(X_train, y_train)

# Evaluate
score = model.score(X_test, y_test)
print("Model R2 Score:", score)

# Save model
joblib.dump(model, "aqi_model.pkl")

print("Model saved successfully!")
