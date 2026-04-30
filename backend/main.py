from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import joblib
import numpy as np
import pandas as pd
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Gemini API securely
api_key = os.environ.get("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)
else:
    print("WARNING: GEMINI_API_KEY environment variable not set. Please create a .env file.")
generation_config = {
  "temperature": 0.7,
  "top_p": 0.95,
  "top_k": 64,
  "max_output_tokens": 8192,
  "response_mime_type": "text/plain",
}
gemini_model = genai.GenerativeModel(
  model_name="gemini-2.5-flash",
  generation_config=generation_config,
)

app = FastAPI(title="CHIRAG API", description="ML Backend for Pediatric Risk Prediction")

# Enable CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the ML models
try:
    growth_model = joblib.load("models/growth_model.pkl")
    asd_model = joblib.load("models/asd_model.pkl")
except Exception as e:
    print("Warning: Models not found. Please run train_models.py first.")

# Pydantic Schemas
class GrowthInput(BaseModel):
    age_months: int
    weight_kg: float
    height_cm: float
    diet_diversity: int

class ASDInput(BaseModel):
    q_scores: List[int] # 10 boolean integers

class GuidanceInput(BaseModel):
    risk_level: str
    module_type: str # 'growth' or 'asd'
    probability: float

@app.post("/api/predict/growth")
def predict_growth(data: GrowthInput):
    # Prepare input for the model
    features = pd.DataFrame([{
        'age_months': data.age_months, 
        'weight_kg': data.weight_kg, 
        'height_cm': data.height_cm, 
        'diet_diversity': data.diet_diversity
    }])
    
    # Predict Stunting Risk
    # RandomForest predict_proba returns probability for [class_0, class_1]
    risk_prob = growth_model.predict_proba(features)[0][1]
    is_high_risk = bool(growth_model.predict(features)[0])
    
    return {
        "status": "success",
        "stunting_risk_probability": round(float(risk_prob), 4),
        "is_high_risk": is_high_risk,
        "actionable_alert": "Red" if risk_prob > 0.7 else "Orange" if risk_prob > 0.4 else "Green"
    }

@app.post("/api/predict/asd")
def predict_asd(data: ASDInput):
    if len(data.q_scores) != 10:
        return {"error": "Exactly 10 Q-CHAT scores required"}
        
    features = pd.DataFrame([data.q_scores], columns=[f'A{i}' for i in range(1, 11)])
    
    # Predict ASD Risk
    # SVM (with probability=True) predict_proba
    risk_prob = asd_model.predict_proba(features)[0][1]
    is_high_risk = bool(asd_model.predict(features)[0])
    
    return {
        "status": "success",
        "asd_risk_probability": round(float(risk_prob), 4),
        "is_high_risk": is_high_risk,
        "actionable_alert": "Red Flag" if risk_prob > 0.6 else "Monitor"
    }

@app.get("/")
def health_check():
    return {"status": "active", "models_loaded": True}

@app.post("/api/generate_guidance")
def generate_guidance(data: GuidanceInput):
    try:
        if data.module_type == 'growth':
            prompt = f"Act as an empathetic pediatrician. The ML model analyzed a child's biometrics and diet, and detected a {data.risk_level} risk ({data.probability * 100:.1f}%) of stunting/malnutrition. Provide 2 short, simple, actionable sentences of parent guidance. First sentence in Kannada, second sentence in English."
        else:
            prompt = f"Act as an empathetic pediatrician. The ML model analyzed a child's Q-CHAT scores and detected a {data.risk_level} risk ({data.probability * 100:.1f}%) of Autism Spectrum Disorder (ASD). Provide 2 short, simple, actionable sentences of parent guidance. First sentence in Kannada, second sentence in English."
            
        chat_session = gemini_model.start_chat(history=[])
        response = chat_session.send_message(prompt)
        
        return {"status": "success", "guidance": response.text.strip()}
    except Exception as e:
        return {"status": "error", "error": str(e), "guidance": "Please consult a healthcare professional. / ದಯವಿಟ್ಟು ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ."}
