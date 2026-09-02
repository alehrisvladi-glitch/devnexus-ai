from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Literal

app = FastAPI(title="DevNexus AI API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GenerateCodeRequest(BaseModel):
    request: str = Field(min_length=5, max_length=6000)
    language: str = "typescript"
    framework: str | None = None
    level: Literal["basic", "junior", "intermediate", "advanced"] = "junior"
    style: str = "standard"

class AnalyzeCodeRequest(BaseModel):
    code: str = Field(min_length=1, max_length=20000)
    language: str

class GenerateDocsRequest(BaseModel):
    code: str = Field(min_length=1, max_length=20000)
    language: str
    format: Literal["docstrings", "comments", "readme"] = "docstrings"

@app.get("/health")
async def health():
    return {"status": "ok", "service": "devnexus-api"}

@app.post("/generate-code")
async def generate_code(payload: GenerateCodeRequest):
    framework_note = f" using {payload.framework}" if payload.framework else ""
    demo_code = (
        "export type User = { id: string; name: string };\n\n"
        "export function filterUsers(users: User[], query: string): User[] {\n"
        "  const normalizedQuery = query.trim().toLowerCase();\n"
        "  if (!normalizedQuery) return users;\n\n"
        "  return users.filter((user) =>\n"
        "    user.name.toLowerCase().includes(normalizedQuery)\n"
        "  );\n"
        "}\n"
    )
    return {
        "title": "Snippet generado para tu solicitud",
        "code": demo_code,
        "explanation": f"Respuesta de demostración para {payload.language}{framework_note}. Configura un proveedor de IA en el servidor para obtener generación real.",
        "suggested_tests": ["Devuelve todos los usuarios con una consulta vacía", "Filtra sin distinguir mayúsculas y minúsculas"],
    }

@app.post("/analyze-code")
async def analyze_code(payload: AnalyzeCodeRequest):
    if not payload.code.strip():
        raise HTTPException(status_code=400, detail="El código no puede estar vacío")
    return {
        "issues": [
            {"severity": "info", "message": "Análisis de demostración", "suggestion": "Conecta un proveedor de IA para recibir una revisión contextual."}
        ],
        "refactored_code": payload.code,
    }

@app.post("/generate-docs")
async def generate_docs(payload: GenerateDocsRequest):
    heading = "Documentación generada"
    content = f"# {heading}\n\nLenguaje: {payload.language}\n\nFormato solicitado: {payload.format}\n\n> Configura un proveedor de IA para generar documentación a partir del código enviado.\n"
    return {"content": content}
