from dotenv import load_dotenv
load_dotenv("../.env")

import os
import time
import pandas as pd
import numpy as np
import joblib

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import text

from database import engine, Base   # ✅ FIX: correct import

from routers import users, reports
from utils.helper import shap_explanation, CI95
from utils.notes import interpret


# ---------------- DATABASE INIT ----------------
max_retries = 5

for i in range(max_retries):
    try:
        print(f"Connecting to database (attempt {i+1}/{max_retries})...")

        # ✅ FIX: no models.Base, use Base directly
        Base.metadata.create_all(bind=engine)

        with engine.connect() as conn:
            conn.execute(text("ALTER TABLE reports ALTER COLUMN crp DROP NOT NULL;"))
            conn.execute(text("ALTER TABLE reports ALTER COLUMN appendix_diameter DROP NOT NULL;"))
            conn.execute(text("ALTER TABLE reports ALTER COLUMN free_fluids DROP NOT NULL;"))
            conn.execute(text("ALTER TABLE reports ALTER COLUMN urinary_ketones DROP NOT NULL;"))
            conn.execute(text("ALTER TABLE reports ALTER COLUMN peritonitis DROP NOT NULL;"))

            try:
                conn.execute(text("ALTER TABLE reports ADD COLUMN IF NOT EXISTS shap_values JSON;"))
            except:
                pass

            conn.commit()

        print("Database connected successfully!")
        break

    except Exception as e:
        if i == max_retries - 1:
            print("Critical Error: DB connection failed")
            raise e

        print(f"DB failed: {e}. Retrying in 5s...")
        time.sleep(5)


# ---------------- FASTAPI APP ----------------
app = FastAPI(title="DharmaAPI")

allowed_origins_env = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,https://dharma-ai.org,http://127.0.0.1:5173"
)

origins = [o.strip() for o in allowed_origins_env.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(reports.router)


# ---------------- MODELS ----------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

Dharma = joblib.load(os.path.join(BASE_DIR, "models/model_Dharma.joblib"))
model_comp = joblib.load(os.path.join(BASE_DIR, "models/dharma_comp.joblib"))
imputer = joblib.load(os.path.join(BASE_DIR, "models/imputer_model.joblib"))


# ---------------- REQUEST MODEL ----------------
class PatientData(BaseModel):
    Nausea: int
    Loss_of_Appetite: int
    Peritonitis: int
    WBC_Count: float
    Neutrophil_Percentage: float
    CRP: float | None = None
    Ketones_in_Urine: float | None = None
    Appendix_Diameter: float | None = None
    Free_Fluids: int | None = None
    Body_Temperature: float


# ---------------- API ----------------
@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.post("/predict")
async def predict(data: PatientData):
    try:
        input_dict = data.dict()

        input_dict["Appendix_Diameter_flag"] = 1 if input_dict.get("Appendix_Diameter") else 0

        df = pd.DataFrame([input_dict]).replace({None: np.nan})

        columns = [
            "Nausea",
            "Loss_of_Appetite",
            "Peritonitis",
            "WBC_Count",
            "Neutrophil_Percentage",
            "CRP",
            "Ketones_in_Urine",
            "Appendix_Diameter",
            "Free_Fluids",
            "Body_Temperature",
            "Appendix_Diameter_flag"
        ]

        df = df[columns]

        model_diag = Dharma.named_steps["model"]

        x_imputed = imputer.transform(df)
        x_df = pd.DataFrame(x_imputed, columns=columns)

        x_diag = x_df[model_diag.feature_names_in_]
        x_comp = x_df[model_comp.feature_names_in_]

        pred_diag = model_diag.predict_proba(x_diag)[0][1]

        upper, lower = CI95(model_diag, x_diag)
        shap_vals, base = shap_explanation(model_diag, x_diag)

        flag = x_diag["Appendix_Diameter_flag"].values[0]
        result, note = interpret(flag, upper, lower, task="diagnosis")

        shap_diag = [
            {"feature": f, "contribution": float(v)}
            for f, v in zip(model_diag.feature_names_in_, shap_vals)
        ]

        return {
            "diagnosis": {
                "probability": round(pred_diag * 100, 0),
                "confidence_interval": [round(lower * 100, 0), round(upper * 100, 0)],
                "result": result,
                "note": note,
                "shap_values": shap_diag,
                "base_value": round(base, 4),
            }
        }

    except Exception as e:
        print("ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))