import os

import jwt
from dotenv import load_dotenv
from fastapi import Header, HTTPException

load_dotenv()
JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")
SUPABASE_URL = os.getenv("SUPABASE_URL", "").rstrip("/")
JWT_ISSUER = os.getenv("SUPABASE_JWT_ISSUER") or (f"{SUPABASE_URL}/auth/v1" if SUPABASE_URL else None)


def get_current_user(authorization: str | None = Header(default=None)) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Falta token de autenticación")
    if not JWT_SECRET:
        raise HTTPException(status_code=503, detail="La autenticación de Supabase no está configurada")
    token = authorization.removeprefix("Bearer ").strip()
    if not token:
        raise HTTPException(status_code=401, detail="Falta token de autenticación")
    try:
        options = {"require": ["exp", "sub", "aud"]}
        decode_kwargs = {"audience": "authenticated", "algorithms": ["HS256"], "options": options}
        if JWT_ISSUER:
            decode_kwargs["issuer"] = JWT_ISSUER
        claims = jwt.decode(token, JWT_SECRET, **decode_kwargs)
        if not isinstance(claims.get("sub"), str) or not claims["sub"].strip():
            raise jwt.InvalidTokenError("sub inválido")
        return claims
    except jwt.PyJWTError as exc:
        raise HTTPException(status_code=401, detail="Token no válido o caducado") from exc
