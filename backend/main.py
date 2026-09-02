import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Literal
from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="DevNexus AI API", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
ANTHROPIC_MODEL = os.getenv("ANTHROPIC_MODEL", "claude-sonnet-4-5-20250929")

client = Anthropic(api_key=ANTHROPIC_API_KEY) if ANTHROPIC_API_KEY else None

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

SYSTEM_CODE = """Eres un asistente experto en programacion. Tu objetivo es generar codigo limpio, funcional y bien explicado.
- Devuelve solo JSON valido con las claves: "title", "code", "explanation", "suggested_tests".
- El campo "code" debe contener unicamente el codigo, sin bloques markdown.
- La explicacion debe ser clara y didactica, adaptada al nivel indicado.
- Los tests deben ser concretos y ejecutables."""

SYSTEM_ANALYZE = """Eres un revisor de codigo senior. Analiza el codigo sin ejecutarlo.
- Devuelve solo JSON valido con las claves: "issues" (lista de objetos con severity, message, suggestion) y "refactored_code".
- El campo "refactored_code" debe contener unicamente el codigo refactorizado, sin bloques markdown.
- Solo reporta problemas reales y explica como solucionarlos."""

SYSTEM_DOCS = """Eres un tecnico de documentacion. Genera documentacion util y concisa.
- Devuelve solo JSON valido con la clave: "content".
- El campo "content" debe contener unicamente la documentacion en Markdown, sin bloques markdown adicionales."""

@app.get("/health")
async def health():
    return {"status": "ok", "service": "devnexus-api", "ai_provider": "anthropic" if client else "demo"}

@app.post("/generate-code")
async def generate_code(payload: GenerateCodeRequest):
    if not client:
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
            "explanation": f"Respuesta de demostracion para {payload.language}{framework_note}. Configura ANTHROPIC_API_KEY para obtener generacion real.",
            "suggested_tests": ["Devuelve todos los usuarios con una consulta vacia", "Filtra sin distinguir mayusculas y minusculas"],
        }

    framework_ctx = f"Framework: {payload.framework}. " if payload.framework else ""
    prompt = f"""Genera codigo para la siguiente solicitud:

Solicitud: {payload.request}
Lenguaje: {payload.language}
{framework_ctx}Nivel: {payload.level}
Estilo: {payload.style}

Importante: responde solo con JSON valido."""

    try:
        response = client.messages.create(
            model=ANTHROPIC_MODEL,
            max_tokens=2048,
            system=SYSTEM_CODE,
            messages=[{"role": "user", "content": prompt}],
        )
        text = response.content[0].text.strip()
        import json
        data = json.loads(text)
        return {
            "title": data.get("title", "Codigo generado"),
            "code": data.get("code", ""),
            "explanation": data.get("explanation", ""),
            "suggested_tests": data.get("suggested_tests", []),
        }
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Error al generar codigo con IA: {str(e)}")

@app.post("/analyze-code")
async def analyze_code(payload: AnalyzeCodeRequest):
    if not client:
        return {
            "issues": [{"severity": "info", "message": "Analisis de demostracion", "suggestion": "Configura ANTHROPIC_API_KEY para un analisis real."}],
            "refactored_code": payload.code,
        }

    prompt = f"""Analiza el siguiente codigo en {payload.language}:

```{payload.language}
{payload.code}
```

Importante: responde solo con JSON valido."""

    try:
        response = client.messages.create(
            model=ANTHROPIC_MODEL,
            max_tokens=2048,
            system=SYSTEM_ANALYZE,
            messages=[{"role": "user", "content": prompt}],
        )
        import json
        data = json.loads(response.content[0].text.strip())
        return {
            "issues": data.get("issues", []),
            "refactored_code": data.get("refactored_code", payload.code),
        }
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Error al analizar codigo con IA: {str(e)}")

@app.post("/generate-docs")
async def generate_docs(payload: GenerateDocsRequest):
    if not client:
        return {"content": "# Documentacion generada\n\nConfigura ANTHROPIC_API_KEY para generar documentacion real."}

    prompt = f"""Genera documentacion en formato {payload.format} para el siguiente codigo en {payload.language}:

```{payload.language}
{payload.code}
```

Importante: responde solo con JSON valido."""

    try:
        response = client.messages.create(
            model=ANTHROPIC_MODEL,
            max_tokens=1024,
            system=SYSTEM_DOCS,
            messages=[{"role": "user", "content": prompt}],
        )
        import json
        data = json.loads(response.content[0].text.strip())
        return {"content": data.get("content", "")}
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Error al generar documentacion con IA: {str(e)}")
