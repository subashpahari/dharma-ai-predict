# Dharma AI Prediction Backend

This is the FastAPI backend for the Dharma AI Prediction tool. It uses scikit-learn models to provide accurate appendicitis predictions.

## Setup

1.  **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

2.  **Run the server**:
    ```bash
    uvicorn main:app --reload --port 8000
    ```

## API Endpoints

### POST `/predict`

Predicts the likelihood of appendicitis based on patient data.

**Request Body**:
```json
{
  "Nausea": 1,
  "Loss_of_Appetite": 1,
  "Peritonitis": 0,
  "WBC_Count": 10.5,
  "Body_Temperature": 38.2,
  "Neutrophil_Percentage": 75.0,
  "CRP": 12.5,
  "Ketones_in_Urine": 1,
  "Appendix_Diameter": 7.5,
  "Free_Fluids": 1
}
```

**Response**:
Returns diagnosis and complication probabilities, confidence intervals, and SHAP explanations.
