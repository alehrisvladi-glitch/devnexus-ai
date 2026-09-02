# Quickstart — DevNexus AI en 10 minutos

## 1. Clona el repositorio

```bash
git clone https://github.com/alehrisvladi-glitch/devnexus-ai.git
cd devnexus-ai
```

## 2. Backend

```bash
cd backend
python -m venv .venv
# Windows: .\.venv\Scripts\Activate.ps1
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
```

Crea `backend/.env` con:

```env
ANTHROPIC_API_KEY=sk-ant-tu-clave
ANTHROPIC_MODEL=claude-sonnet-4-5-20250929
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu_clave_publica
SUPABASE_JWT_SECRET=tu_jwt_secret
CORS_ORIGINS=http://localhost:5173
```

Inicia el servidor:

```bash
uvicorn main:app --reload --port 8000
```

## 3. Frontend

En otra terminal:

```bash
cd frontend
npm install
```

Crea `frontend/.env` con:

```env
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_publica
```

Inicia el frontend:

```bash
npm run dev
```

## 4. Prueba

1. Abre http://localhost:5173
2. Pulsa `Iniciar sesion` y crea una cuenta.
3. Escribe una solicitud y pulsa `Generar codigo`.
4. Pulsa `Guardar` para persistir el snippet.

## 5. Supabase (si no lo has hecho)

1. Crea un proyecto en https://supabase.com
2. En SQL Editor, ejecuta `supabase/schema.sql`.
3. Habilita Email/Password en Authentication > Providers.
4. Copia URL y clave publica para los archivos `.env`.

## Siguiente nivel

- Despliega el frontend en Vercel y el backend en Railway.
- Añ¡¡¡ade limites de uso, favoritos y exportacion.
- Conecta GitHub para importar repositorios.
