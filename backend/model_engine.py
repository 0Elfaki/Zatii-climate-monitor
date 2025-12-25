import pandas as pd
import numpy as np
import xgboost as xgb
import io
from functools import reduce

def feature_engineering(df: pd.DataFrame) -> pd.DataFrame:
    """Applies Physics and Memory features to the merged data."""
    df = df.copy()
    
    # 1. Imputation
    num_cols = df.select_dtypes(include=[np.number]).columns
    df[num_cols] = df[num_cols].interpolate(method='linear').bfill().ffill()
    
    # 2. Physics: Desiccation Index
    try:
        vpd_col = [c for c in df.columns if 'vpd' in c or 'vapour' in c][0]
        sm_col = [c for c in df.columns if 'moist' in c][0]
        df['desiccation_index'] = df[vpd_col] / (df[sm_col] + 0.001)
    except IndexError:
        pass 

    # 3. Memory: 30-Day Rolling
    # Apply to all numeric columns (except date)
    for col in num_cols:
        df[f'{col}_roll30'] = df[col].rolling(30, min_periods=1).mean()
        
    # Drop the first 30 rows where rolling values are NaN (optional, or fill)
    df = df.bfill()
    return df

def process_and_predict(file_dict):
    """
    Accepts a dictionary {filename: bytes}, merges them, and runs predictions.
    """
    dfs = []
    
    # --- 1. HARVEST & MERGE (Titanium Logic) ---
    for filename, content in file_dict.items():
        try:
            # Read bytes into pandas
            df = pd.read_csv(io.BytesIO(content))
            
            # Standardize 'valid_time' -> 'date'
            if 'valid_time' in df.columns:
                df = df.rename(columns={'valid_time': 'date'})
            
            # CRITICAL: Normalize Date (Hourly -> Daily)
            df['date'] = pd.to_datetime(df['date']).dt.normalize()
            
            # Group by Date
            df = df.groupby('date', as_index=False).mean(numeric_only=True)
            
            # Unique Column Naming
            prefix = filename.replace(".csv", "").replace(" ", "_").replace("_test", "").replace("_train", "").lower()
            cols_to_rename = {c: f"{prefix}_{c}" for c in df.columns if c != 'date'}
            df = df.rename(columns=cols_to_rename)
            
            dfs.append(df)
        except Exception as e:
            print(f"Error processing {filename}: {e}")
            continue

    if not dfs:
        raise ValueError("No valid CSV files processed.")

    # Merge all into one timeline
    master_df = reduce(lambda l, r: l.merge(r, on='date', how='outer'), dfs)
    master_df = master_df.sort_values('date').reset_index(drop=True)
    
    # --- 2. FEATURE ENGINEERING ---
    # Apply the exact same transformation as training
    processed_df = feature_engineering(master_df)
    
    # Prepare X (Features) and Dates
    dates = processed_df['date']
    X = processed_df.drop(columns=['date'])
    
    # --- 3. LOAD MODEL (The Fix) ---
    # We use xgb.Booster because we saved it with get_booster().save_model()
    model = xgb.Booster()
    model.load_model("model.json")
    
    # Convert to DMatrix (Required for Booster)
    dtest = xgb.DMatrix(X)
    
    # --- 4. PREDICT ---
    probs = model.predict(dtest)
    
    # --- 5. FORMAT RESULTS ---
    results = []
    for date, prob in zip(dates, probs):
        results.append({
            "date": date.strftime('%Y-%m-%d'),
            "risk_score": float(prob),
            "status": "High Risk" if prob > 0.25 else "Normal"
        })
        
    return results