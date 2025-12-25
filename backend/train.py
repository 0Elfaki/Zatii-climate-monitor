import pandas as pd
import numpy as np
from pathlib import Path
from functools import reduce
from xgboost import XGBClassifier
import os

# --- CONFIG ---
# Ensure this points to where your CSV files are
DATA_DIR = Path(r"D:\Indaba\dry_spell_project\data\train") 
MODEL_PATH = "model.json"

def load_and_merge_all(dir_path: Path) -> pd.DataFrame:
    """Harvests all CSVs and merges them."""
    all_files = list(dir_path.glob("*.csv"))
    dfs = []
    
    for path in all_files:
        if "solution_train" in path.name: continue
        try:
            df = pd.read_csv(path)
            if 'valid_time' in df.columns:
                df = df.rename(columns={'valid_time': 'date'})
            
            # Collapse Hourly -> Daily
            df['date'] = pd.to_datetime(df['date']).dt.normalize()
            df = df.groupby('date', as_index=False).mean(numeric_only=True)
            
            # Unique Naming
            prefix = path.name.replace("_train.csv", "").replace(" ", "_").lower()
            cols_to_rename = {c: f"{prefix}_{c}" for c in df.columns if c != 'date'}
            df = df.rename(columns=cols_to_rename)
            dfs.append(df)
        except Exception:
            continue

    if not dfs: return pd.DataFrame()
    return reduce(lambda l, r: l.merge(r, on='date', how='outer'), dfs)

def feature_engineering(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    
    # Imputation
    num_cols = df.select_dtypes(include=[np.number]).columns
    df[num_cols] = df[num_cols].interpolate(method='linear').bfill().ffill()
    
    # Physics: Desiccation Index
    try:
        vpd_col = [c for c in df.columns if 'vpd' in c or 'vapour' in c][0]
        sm_col = [c for c in df.columns if 'moist' in c][0]
        df['desiccation_index'] = df[vpd_col] / (df[sm_col] + 0.001)
    except IndexError:
        pass 

    # Memory: 30-Day Rolling
    for col in num_cols:
        df[f'{col}_roll30'] = df[col].rolling(30, min_periods=1).mean()
        
    return df

if __name__ == "__main__":
    print("--- 1. Loading Training Data ---")
    df = load_and_merge_all(DATA_DIR)
    
    # Load Labels
    y_path = DATA_DIR / "solution_train.csv"
    y = pd.read_csv(y_path)
    y['date'] = pd.to_datetime(y['date']).dt.normalize()
    
    # Merge
    df = df.merge(y, on='date', how='inner')
    df = feature_engineering(df)

    X = df.drop(columns=['date', 'dryspell_warn_7d'])
    y = df['dryspell_warn_7d']

    print(f"--- 2. Training Titanium Model on {len(X)} rows ---")
    
    ratio = (float(np.sum(y == 0)) / np.sum(y == 1)) * 1.3
    
    model = XGBClassifier(
        n_estimators=600, 
        tree_method='hist', 
        scale_pos_weight=ratio, 
        random_state=42
    )
    model.fit(X, y)

    # --- FIX APPLIED HERE ---
    # We save the "Booster" (Brain) directly to bypass the Wrapper error
    model.get_booster().save_model(MODEL_PATH)
    
    print(f"✅ Model saved successfully to: {MODEL_PATH}")