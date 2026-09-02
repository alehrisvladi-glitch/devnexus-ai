import json
import os
from typing import Literal

from anthropic import Anthropic
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from supabase import Client, create_client
from supabase_auth import get_current_user

load_dotenv()

app = FastAPI(title="DevNexus AI API", version="0.4.0")
allowed_origins = [origin.strip() for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")]
app.add_middleware(CORSMiddleware, allow_origins=allowed_origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
ANTHROPIC_MODEL = os.getenv("ANTHROPIC_MODEL", "claude-sonnet-4-5-20250929")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
client = Anthropic(api_key=ANTHROPIC_API_KEY) if ANTHROPIC_API_KEY else None
supabase: Client | None = create_client(SUPABASE_URL, SUPABASE_ANON_KEY) if SUPABASE_URL and SUPABASE_ANON_KEY else None

class GenerateCodeRequest(BaseModel):
    request: str = Field(min_length=5, max_length=6000)
    language: str = "typescript"
    framework: str | None = None
    level: Literal["basic", "junior", "intermediate", "advanced"] = "junior"
    style: str = "standard"

class SnippetCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    prompt: str | None = Field(default=None, max_length=6000)
    code: str = Field(min_length=1, max_length=20000)
    language: str
    framework: str | None = None
    category: str | None = None

SYSTEM_CODE = """Eres un asistente experto en programacion. Devuelve solo JSON valido con title, code, explanation y suggested_tests. code contiene solo codigo, sin markdown. Explica con claridad para el nivel pedido y propone tests concretos."""

@app.get("/health")
async def health():
    return {"status": "ok", "service": "devnexus-api", "ai_provider": "anthropic" if client else "demo", "supabase": bool(supabase)}

@app.post("/generate-code")
async def generate_code(payload: GenerateCodeRequest):
    if not client:
        return {"title": "Snippet de demostracion", "code": "export function hello() {\n  return 'Configura ANTHROPIC_API_KEY';\n}\n", "explanation": "Configura Anthropic para recibir generacion real.", "suggested_tests": ["Comprueba el valor de retorno"]}
    prompt = f"Solicitud: {payload.request}\nLenguaje: {payload.language}\nFramework: {payload.framework or 'ninguno'}\nNivel: {payload.level}\nEstilo: {payload.style}\nResponde solo con JSON valido."
    try:
        response = client.messages.create(model=ANTHROPIC_MODEL, max_tokens=2048, system=SYSTEM_CODE, messages=[{"role": "user", "content": prompt}])
        data = json.loads(response.content[0].text.strip())
        return {"title": data.get("title", "Codigo generado"), "code": data.get("code", ""), "explanation": data.get("explanation", ""), "suggested_tests": data.get("suggested_tests", [])}
    except Exception:
        raise HTTPException(status_code=502, detail="No se pudo generar codigo con el proveedor de IA")

@app.get("/snippets")
async def list_snippets(user: dict = Depends(get_current_user)):
    if not supabase:
        raise HTTPException(status_code=503, detail="Supabase no esta configurado")
    response = supabase.table("snippets").select("id,title,code,language,framework,is_favorite,created_at").eq("user_id", user["sub"]).order("created_at", desc=True).execute()
    return response.data

@app.post("/snippets", status_code=201)
async def create_snippet(payload: SnippetCreate, user: dict = Depends(get_current_user)):
    if not supabase:
        raise HTTPException(status_code=503, detail="Supabase no esta configurado")
    row = {**payload.model_dump(), "user_id": user["sub"]}
    response = supabase.table("snippets").insert(row).execute()
    return response.data[0]
