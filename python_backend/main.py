from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np
from typing import Optional
from utils.helper import shap_explanation, CI95
from utils.notes import interpret
from sklearn.model_selection import train_test_split
import os

app = FastAPI(title="DharmaAPI")


# CORS settings
origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1",
    "http://127.0.0.1:8000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "https://dharma-ai.org",  
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Input schema
class PatientData(BaseModel):
    Nausea: int
    Loss_of_Appetite: int
    Peritonitis: int
    WBC_Count: float
    Neutrophil_Percentage: float
    CRP: Optional[float] = None
    Ketones_in_Urine: Optional[float] = None
    Appendix_Diameter: Optional[float] = None
    Free_Fluids: Optional[int] = None
    Body_Temperature: float


# Load models
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
Dharma = joblib.load(os.path.join(BASE_DIR, "models/model_Dharma.joblib"))
model_comp = joblib.load(os.path.join(BASE_DIR, "models/dharma_comp.joblib"))
imputer = joblib.load(os.path.join(BASE_DIR, "models/imputer_model.joblib"))



@app.post("/predict")
async def predict(data: PatientData):
    try:
        # Convert input into DataFrame
        input_dict = data.dict()
        
        # Explicitly calculate the flag based on Appendix_Diameter presence
        input_dict['Appendix_Diameter_flag'] = 1 if input_dict.get('Appendix_Diameter') is not None else 0
        
        df = pd.DataFrame([input_dict])
        df = df.replace({None: np.nan})
        
        # Ensure column order matches what the model pipeline expects
        columns = ['Nausea', 'Loss_of_Appetite', 'Peritonitis', 'WBC_Count', 'Neutrophil_Percentage', 'CRP', 'Ketones_in_Urine', 'Appendix_Diameter', 'Free_Fluids', 'Body_Temperature', 'Appendix_Diameter_flag']
        df = df[columns]

        # Extract steps from pipeline
        model_diag = Dharma.named_steps['model']

        # Impute missing values
        x_imputed = imputer.transform(df)

        # Create imputed DataFrame with original column names
        x_imputed_df = pd.DataFrame(x_imputed, columns=columns)

        # Subsets for diagnosis and complication models
        x_imputed_diag_df = x_imputed_df[model_diag.feature_names_in_]
        x_imputed_comp_df = x_imputed_df[model_comp.feature_names_in_]

        # Predictions
        pred_diag = model_diag.predict_proba(x_imputed_diag_df)[0][1]

        upper_ci_diag, lower_ci_diag = CI95(model_diag, x_imputed_diag_df)
        shap_diag, base_diag = shap_explanation(model_diag, x_imputed_diag_df)
        flag = x_imputed_diag_df['Appendix_Diameter_flag'].values[0]
        result_diag, note_diag = interpret(flag, upper_ci_diag, lower_ci_diag, task='diagnosis')

        # Prepare SHAP explanations with feature names
        shap_diag_dict = [
            {"feature": name, "contribution": float(val)}
            for name, val in zip(model_diag.feature_names_in_, shap_diag)
        ]


        # Condition for complications: Diagnosis is not definitely low likelihood
        # Threshold: 0.5 if flag=0, 0.25 if flag=1
        threshold = 0.5 if flag == 0 else 0.25
        
        if upper_ci_diag > threshold:
            pred_comp = model_comp.predict_proba(x_imputed_comp_df)[0][1]
            upper_ci_comp, lower_ci_comp = CI95(model_comp, x_imputed_comp_df)
            shap_comp, base_comp = shap_explanation(model_comp, x_imputed_comp_df)
            result_comp, note_comp = interpret(flag, upper_ci_comp, lower_ci_comp, task='complication')

            shap_comp_dict = [
                {"feature": name, "contribution": float(val)}
                for name, val in zip(model_comp.feature_names_in_, shap_comp)
            ]

            comp_result = {
                "probability": round(pred_comp * 100, 0),
                "confidence_interval": [
                    round(lower_ci_comp * 100, 0),
                    round(upper_ci_comp * 100, 0),
                ],
                "result": result_comp,
                "note": note_comp,
                "shap_values": shap_comp_dict,
                "base_value": round(base_comp, 4),
            }

        else:
            comp_result = None

        # Return formatted result
        return {
            "diagnosis": {
                "probability": round(pred_diag * 100, 0),
                "confidence_interval": [
                    round(lower_ci_diag * 100, 0),
                    round(upper_ci_diag * 100, 0),
                ],
                "result": result_diag,
                "note": note_diag,
                "shap_values": shap_diag_dict,
                "base_value": round(base_diag, 4),
            },
            "complication": comp_result
        }


    except Exception as e:
        print("Error:", e)
        raise HTTPException(status_code=500, detail=str(e))
