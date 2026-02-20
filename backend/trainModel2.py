import pandas as pd
import numpy as np
from xgboost import XGBClassifier
from sklearn.preprocessing import LabelEncoder
import joblib

df = pd.read_csv("../dataset/delhi_master_dataset_june2018.csv")

df = df.ffill()
df = df.fillna(0)

def assign_source(row):
    if row["NO2"] > 80 and row["CO"] > 1:
        return "Traffic"
    elif row["SO2"] > 15:
        return "Industry"
    elif row["PM10"] > 300:
        return "Construction"
    elif row["PM25"] > 200:
        return "Mixed"
    else:
        return "Background"

df["Source"] = df.apply(assign_source, axis=1)

features = ["PM25", "PM10", "NO2", "SO2", "O3", "CO"]
X = df[features]

le = LabelEncoder()
y = le.fit_transform(df["Source"])

print("Class Distribution:")
print(df["Source"].value_counts())

model = XGBClassifier(
    n_estimators=150,
    max_depth=4,
    learning_rate=0.1,
    objective="multi:softprob",
    eval_metric="mlogloss"
)

model.fit(X, y)

joblib.dump(model, "../backend/aqi_source_model.pkl")
joblib.dump(le, "../backend/label_encoder.pkl")

print("\n✅ Model trained successfully!")