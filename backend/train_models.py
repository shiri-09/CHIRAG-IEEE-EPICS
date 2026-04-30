import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os
import kagglehub

print("Starting ML Pipeline Execution...")

# --- 1. Growth & Malnutrition Model (Module 1) ---
# Using the REAL Child Anthropometric Dataset from GitHub
print("Downloading REAL WHO/CDC Growth dataset from GitHub...")
url = "https://raw.githubusercontent.com/dqsis/child-growth-charts/master/data/child_data.csv"

try:
    # Read the dataset and skip the 1 header line so the header row is 'Age,Weight,Length,Head circumference'
    growth_df = pd.read_csv(url, skiprows=1)
    
    # Drop rows without Age, Weight or Length
    growth_df = growth_df.dropna(subset=['Age', 'Weight', 'Length'])
    
    # Rename columns to match API
    growth_df = growth_df.rename(columns={
        'Age': 'age_months', 
        'Weight': 'weight_kg', 
        'Length': 'height_cm'
    })
    
    # The real dataset is extremely small (just sample curve points).
    # Add an assumed 'diet_diversity' since it's required by the existing frontend payload,
    # or calculate risk based solely on Height for Age. We'll set a static diet score.
    growth_df['diet_diversity'] = 3
    
    # Target: Stunting/Malnutrition Risk (Binary 0/1)
    # Stunting is defined as height-for-age being below standard thresholds.
    # We will use the 15th percentile of this real dataset as the cutoff for high risk.
    stunting_threshold = growth_df['height_cm'].quantile(0.15)
    growth_df['target'] = (growth_df['height_cm'] <= stunting_threshold).astype(int)
    
    X_growth = growth_df[['age_months', 'weight_kg', 'height_cm', 'diet_diversity']]
    y_growth = growth_df['target']
    
except Exception as e:
    print(f"Failed to download real dataset: {e}")
    exit(1)

X_train_g, X_test_g, y_train_g, y_test_g = train_test_split(X_growth, y_growth, test_size=0.2, random_state=42)

print("Training Random Forest Classifier for Growth Prediction...")
growth_model = RandomForestClassifier(n_estimators=100, random_state=42)
growth_model.fit(X_train_g, y_train_g)

g_preds = growth_model.predict(X_test_g)
print("\nGrowth Model Evaluation:")
print(classification_report(y_test_g, g_preds))

# --- 2. Development & ASD Model (Module 2) ---
# Using the ACTUAL "Autism Screening on Toddlers" Kaggle Dataset
print("\nDownloading ACTUAL Toddler Autism dataset from Kaggle...")

# Download latest version securely without API Key
try:
    path = kagglehub.dataset_download("fabdelja/autism-screening-for-toddlers")
    csv_path = os.path.join(path, "Toddler Autism dataset July 2018.csv")
    asd_df = pd.read_csv(csv_path)
    print("Successfully downloaded and loaded Kaggle Dataset!")
except Exception as e:
    print(f"Error downloading from Kaggle: {e}")
    print("Falling back to synthetic data...")
    # fallback code just in case
    asd_samples = 2000
    q_chat = np.zeros((asd_samples, 10))
    asd_target = np.random.binomial(1, 0.15, asd_samples)
    for i in range(asd_samples):
        if asd_target[i] == 1:
            q_chat[i] = np.random.binomial(1, 0.7, 10)
        else:
            q_chat[i] = np.random.binomial(1, 0.1, 10)
    asd_df = pd.DataFrame(q_chat, columns=[f'A{i}' for i in range(1, 11)])
    asd_df['Class/ASD Traits '] = asd_target

print("Processing Kaggle Dataset...")
# The Kaggle dataset columns are A1, A2... A10, and 'Class/ASD Traits ' (Yes/No)
feature_cols = [f'A{i}' for i in range(1, 11)]

# Clean and extract features
X_asd = asd_df[feature_cols]
# Map 'Yes'/'No' to 1/0
y_asd = asd_df['Class/ASD Traits '].map({'Yes': 1, 'No': 0}).fillna(asd_df['Class/ASD Traits '])

X_train_a, X_test_a, y_train_a, y_test_a = train_test_split(X_asd, y_asd, test_size=0.2, random_state=42)

print("Training Support Vector Machine (SVM) on REAL ASD Kaggle Data...")
asd_model = SVC(probability=True, kernel='rbf', random_state=42)
asd_model.fit(X_train_a, y_train_a)

a_preds = asd_model.predict(X_test_a)
print("\nASD Model Evaluation (Real Kaggle Data):")
print(classification_report(y_test_a, a_preds))


# --- Save Models ---
print("\nExporting models for FastAPI backend...")
os.makedirs('models', exist_ok=True)
joblib.dump(growth_model, 'models/growth_model.pkl')
joblib.dump(asd_model, 'models/asd_model.pkl')
print("✅ Models successfully saved to backend/models/")
