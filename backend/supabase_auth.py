import os
import jwt
from fastapi import Header, HTTPException

JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")

def get_current_user(authorization: str | None = Header(default=None)) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Falta token de autenticacion")
    if not JWT_SECRET:
        raise HTTPException(status_code=503, detail="La autenticacion de Supabase no esta configurada")
    token = authorization.removeprefix("Bearer ")
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=["HS256"], audience="authenticated")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Token no valido o caducado")
