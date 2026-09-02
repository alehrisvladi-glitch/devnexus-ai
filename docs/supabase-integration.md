# Integracion de Supabase

## Preparado en el proyecto

- Cliente de Supabase en `frontend/src/lib/supabase.ts`.
- Componente para login, registro y logout mediante email/contrase#a.
- JWT enviado al backend mediante `Authorization: Bearer <token>`.
- Archivo `backend/supabase_auth.py` preparado para validar JWTs.
- Esquema SQL y politicas RLS disponibles en `supabase/schema.sql`.

## Configuracion posterior

1. Crea o selecciona un proyecto de Supabase.
2. En SQL Editor, ejecuta `supabase/schema.sql`.
3. Habilita Email/Password en Authentication > Providers.
4. Copia la Project URL y la publishable/anon key.
5. Crea `frontend/.env` con:

```env
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_publica
```

6. Crea `backend/.env` con:

```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu_clave_publica
SUPABASE_JWT_SECRET=tu_jwt_secret_solo_backend
CORS_ORIGINS=http://localhost:5173
```

No subas los archivos `.env` ni expongas el JWT secret en React.

## Verificacion

1. Ejecuta el backend y el frontend.
2. Crea una cuenta desde `Iniciar sesion`.
3. Comprueba que puedes iniciar y cerrar sesion.
4. Conecta despues el guardado de snippets a las rutas protegidas del backend.
