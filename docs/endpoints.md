# Endpoints de API — FastAPI

La API debe verificar el JWT de Supabase antes de cualquier operación que acceda a datos privados. La clave del proveedor de IA vive únicamente en el backend.

## POST /generate-code

Genera una respuesta estructurada de código.

### Petición

```json
{
  "request": "Crea un componente React de lista de usuarios con búsqueda y filtro",
  "language": "typescript",
  "framework": "react",
  "level": "junior",
  "style": "airbnb"
}
```

### Respuesta

```json
{
  "title": "UserList con búsqueda y filtro",
  "code": "export function UserList() { /* ... */ }",
  "explanation": "El componente mantiene el término de búsqueda...",
  "suggested_tests": ["Filtra usuarios por nombre", "Muestra el estado vacío"]
}
```

## POST /analyze-code

Analiza código sin ejecutarlo en el servidor.

### Petición

```json
{
  "code": "def divide(a, b): return a / b",
  "language": "python"
}
```

### Respuesta

```json
{
  "issues": [
    {
      "severity": "medium",
      "message": "No se controla la división por cero",
      "suggestion": "Valida b antes de dividir"
    }
  ],
  "refactored_code": "def divide(a, b):\n    if b == 0:\n        raise ValueError('b no puede ser cero')\n    return a / b"
}
```

## POST /generate-docs

Genera docstrings, comentarios o un README.

### Petición

```json
{
  "code": "export const sum = (a: number, b: number) => a + b;",
  "language": "typescript",
  "format": "docstrings"
}
```

### Respuesta

```json
{
  "content": "/** Suma dos valores numéricos. */\nexport const sum = ..."
}
```

## FastAPI: estructura mínima

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI(title="DevNexus AI API")

class GenerateCodeRequest(BaseModel):
    request: str = Field(min_length=5, max_length=6000)
    language: str
    framework: str | None = None
    level: str = "junior"
    style: str = "standard"

@app.post("/generate-code")
async def generate_code(payload: GenerateCodeRequest):
    # 1. Validar JWT de Supabase desde el header Authorization.
    # 2. Aplicar límite de uso del plan.
    # 3. Llamar al proveedor de IA desde el servidor.
    # 4. Validar y devolver el JSON esperado.
    raise HTTPException(status_code=501, detail="Proveedor de IA aún no configurado")
```

## Reglas de seguridad

- No ejecutar código enviado por usuarios para analizarlo.
- Limitar tamaño de código y frecuencia de peticiones.
- Registrar errores sin guardar secretos ni datos sensibles.
- Escapar Markdown/HTML mostrado en el cliente.
- Revisar manualmente el código generado antes de usarlo en producción.
