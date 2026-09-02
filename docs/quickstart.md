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
SUPABASE_JWT_ISSUER=https://tu-proyecto.supabase.co/auth/v1
CORS_ORIGINS=http://localhost:5173
AI_REQUESTS_PER_MINUTE=10
LOG_LEVEL=INFO
# Opcional: habilita GET /github/repositories en modo lectura
GITHUB_TOKEN=tu_token_de_github
GITHUB_OWNER=tu_usuario_o_organizacion
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

1. Abre http://localhost:5173.
2. Pulsa `Iniciar sesion` y crea una cuenta.
3. Escribe una solicitud y pulsa `Generar codigo`; la sesión es obligatoria.
4. Pulsa `Guardar` para persistir el snippet.
5. Si configuraste `GITHUB_TOKEN` y `GITHUB_OWNER`, pulsa `Repositorios GitHub` para consultar repositorios en modo lectura.
6. Comprueba `/health`: el proveedor debe aparecer como `anthropic` y GitHub como `true` solo si el token está configurado.

## 5. Supabase (si no lo has hecho)

1. Crea un proyecto en https://supabase.com
2. En SQL Editor, ejecuta `supabase/schema.sql`.
3. Habilita Email/Password en Authentication > Providers.
4. Copia URL y clave publica para los archivos `.env`.

## Seguridad y despliegue

La API key de Anthropic, el token de GitHub y el secreto JWT deben configurarse únicamente en el entorno del backend. Nunca los añadas a `frontend/.env` ni los subas al repositorio. El límite `AI_REQUESTS_PER_MINUTE` es local al proceso; en despliegues con varias réplicas debe sustituirse por un almacén compartido, como Redis o una tabla de cuotas en Supabase.

`POST /generate-code` requiere un JWT válido de Supabase y devuelve `401` si falta la sesión, `429` cuando se supera el límite temporal, `502` ante una respuesta inválida del proveedor y `503` si Anthropic no está configurado. La ruta `GET /github/repositories` es deliberadamente de lectura y requiere una credencial de GitHub configurada en el backend.

## Siguiente nivel

El siguiente paso recomendado es conectar GitHub mediante OAuth o una GitHub App por usuario, en lugar de un token global, y añadir una vista de diff y confirmación explícita antes de cualquier operación de escritura.
