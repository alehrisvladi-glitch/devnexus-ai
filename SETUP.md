# Puesta en marcha local

## Requisitos

- Node.js 20 o superior.
- Python 3.11 o superior.
- Un proyecto de Supabase para autenticación y persistencia.

## 1. Configurar Supabase

1. Crea un proyecto en Supabase.
2. Abre el SQL Editor.
3. Ejecuta el contenido de `supabase/schema.sql`.
4. En Authentication, habilita Email/Password.
5. Copia la URL del proyecto y la publishable/anon key para el frontend.

No uses la service role key en React ni la subas a GitHub.

## 2. Ejecutar el backend

```bash
cd backend
python -m venv .venv
# Windows PowerShell:
.\.venv\Scripts\Activate.ps1
# macOS/Linux:
# source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Comprueba `http://localhost:8000/health`.

## 3. Ejecutar el frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

Abre la URL que muestra Vite, normalmente `http://localhost:5173`.

## 4. Variables de entorno

Copia `.env.example` según corresponda. Para Vite, crea `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=tu_url
VITE_SUPABASE_ANON_KEY=tu_clave_publica
```

Las claves de proveedores de IA deben configurarse solo en el entorno del backend/despliegue.

## 5. Despliegue

### Frontend — Vercel o Netlify

- Importa el repositorio desde GitHub.
- Directorio raíz: `frontend`.
- Build command: `npm run build`.
- Output directory: `dist`.
- Añade `VITE_API_URL`, `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` como variables de entorno.

### Backend — Railway o Render

- Directorio raíz: `backend`.
- Build command: `pip install -r requirements.txt`.
- Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`.
- Configura CORS con el dominio real del frontend antes de publicar.

## Estado actual

La interfaz y API están preparadas y usan una respuesta de demostración. El siguiente paso es integrar un proveedor de IA dentro de `backend/main.py`, aplicar autenticación JWT de Supabase y persistir los snippets desde el frontend.
