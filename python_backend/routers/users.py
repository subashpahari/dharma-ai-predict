import os
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
import models, schemas, auth, database
from fastapi.security import OAuth2PasswordRequestForm
from google.oauth2 import id_token
from google.auth.transport import requests

router = APIRouter(prefix="/users", tags=["users"])

# Dependency to get db
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Dependency for current user
def get_current_user(token: str = Depends(auth.oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = auth.decode_access_token(token)
    if payload is None:
        raise credentials_exception
    user_id: str = payload.get("sub")
    if user_id is None:
        raise credentials_exception
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user

@router.post("/register", response_model=dict)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash the password
    hashed_password = auth.get_password_hash(user.password)
    
    # Extract display name from email logic
    display_name = user.email.split('@')[0]
    
    new_user = models.User(
        email=user.email,
        hashed_password=hashed_password,
        display_name=display_name
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {"message": "User registered successfully", "id": new_user.id}

@router.post("/login", response_model=dict)
def login_for_access_token(user_credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user_credentials.email).first()
    
    if not db_user or not db_user.hashed_password:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
        
    if not auth.verify_password(user_credentials.password, db_user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
        
    access_token = auth.create_access_token(data={"sub": str(db_user.id), "email": db_user.email})
    
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "user": {
            "id": str(db_user.id),
            "email": db_user.email,
            "display_name": db_user.display_name
        }
    }


CLIENT_ID = os.getenv("CLIENT_ID", "541974040667-9njaj0qlh7g8k5p994rqr1rikdj26hbn.apps.googleusercontent.com")

@router.post("/google", response_model=dict)
def google_auth(auth_data: schemas.GoogleAuth, db: Session = Depends(get_db)):
    try:
        # Verify the token with Google
        idinfo = id_token.verify_oauth2_token(auth_data.token, requests.Request(), CLIENT_ID)
        
        email = idinfo['email']
        name = idinfo.get('name', email.split('@')[0])
        
        # Check if user exists
        db_user = db.query(models.User).filter(models.User.email == email).first()
        if not db_user:
            # Create user
            db_user = models.User(
                email=email,
                display_name=name,
                hashed_password=None # Google auth
            )
            db.add(db_user)
            db.commit()
            db.refresh(db_user)
            
        access_token = auth.create_access_token(data={"sub": str(db_user.id), "email": db_user.email})
        return {
            "access_token": access_token, 
            "token_type": "bearer",
            "user": {
                "id": str(db_user.id),
                "email": db_user.email,
                "display_name": db_user.display_name
            }
        }
        
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid Google Token")

@router.get("/me", response_model=schemas.UserOut)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user
