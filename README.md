# DevNexus AI

DevNexus AI es una plataforma web de inteligencia artificial para estudiantes de programación, desarrolladores junior y personas que automatizan tareas técnicas. Convierte peticiones en lenguaje natural en código, documentación, pruebas y sugerencias de mejora.

## Objetivo

- Generar código en JavaScript, Python, HTML/CSS, SQL y otros lenguajes.
- Documentar funciones, clases y proyectos.
- Analizar, explicar, depurar y refactorizar código.
- Generar tests unitarios, README, comentarios y docstrings.
- Guardar snippets, historial y favoritos.
- Ofrecer plantillas para frontend, backend, API, bases de datos, scripts y DevOps.

## MVP

El MVP incluye autenticación, generador de código, editor con resaltado de sintaxis, plantillas, historial/favoritos y guardado de snippets. El depurador, documentador, exportación, enlaces compartidos, límites de plan y GitHub se implementan progresivamente durante las dos semanas.

## Stack

- Frontend: React, Tailwind CSS y Monaco Editor.
- Backend: FastAPI (Python).
- Datos y auth: Supabase.
- IA: proveedor configurable mediante una API compatible.
- Despliegue: Vercel para el frontend y Railway/Render para el backend.

## Estructura de documentación

- `docs/wireframe.md`: pantallas y flujo de usuario.
- `docs/plan-mvp-2-semanas.md`: hoja de ruta de 14 días.
- `supabase/schema.sql`: tablas, índices y políticas RLS.
- `docs/endpoints.md`: contrato y ejemplos de endpoints FastAPI.

## Principios

1. No exponer claves de IA ni la service role key de Supabase en el cliente.
2. Aplicar RLS a los datos privados de cada usuario.
3. Explicar el código generado para que la herramienta también enseñe.
4. Pedir contexto (lenguaje, framework, restricciones) cuando mejore el resultado.
5. Tratar las respuestas de IA como propuestas que el usuario debe revisar y probar.
