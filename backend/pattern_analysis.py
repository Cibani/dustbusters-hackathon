import pandas as pd

def detect_patterns(file_path):
    df = pd.read_csv(file_path)

    df["Date"] = pd.to_datetime(df["Date"])
    df["Month"] = df["Date"].dt.month

    monthly_avg = df.groupby("Month")["AQI"].mean()

    highest_month = monthly_avg.idxmax()
    lowest_month = monthly_avg.idxmin()

    return {
        "Worst_Month": int(highest_month),
        "Best_Month": int(lowest_month),
        "Monthly_Average_AQI": monthly_avg.to_dict()
    }
