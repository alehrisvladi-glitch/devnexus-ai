# Plan de desarrollo del MVP — 14 días

## Alcance fijo

Para terminar en dos semanas, el producto debe priorizar: autenticación, generación de código, guardado de snippets, historial/favoritos y plantillas. GitHub OAuth, facturación, subida de repositorios y exportación compleja deben ser iteraciones posteriores o muy básicas.

## Semana 1: núcleo

### Día 1 — Base del proyecto

- Crear repositorio, tablero de tareas y definición de terminado.
- Inicializar React con Vite, TypeScript y Tailwind.
- Crear FastAPI con rutas de salud y CORS configurado.
- Definir variables de entorno y archivo `.env.example` sin secretos.

### Día 2 — Supabase y autenticación

- Crear tablas y RLS con `supabase/schema.sql`.
- Configurar Supabase Auth por correo/contraseña.
- Implementar registro, login, logout y rutas protegidas.

### Día 3 — Interfaz

- Implementar tema oscuro, layout responsive, header y sidebar.
- Preparar Home, Generador, Plantillas, Historial y Perfil.
- Integrar Monaco Editor.

### Día 4 — Generación de código

- Crear `POST /generate-code` en FastAPI.
- Validar petición, construir prompt del sistema y llamar al proveedor de IA en servidor.
- Mostrar código y explicación en el editor.

### Día 5 — Snippets

- Implementar crear, listar, editar/eliminar y favorito para snippets.
- Añadir búsqueda/filtros por lenguaje, framework y favorito.

### Día 6 — Plantillas

- Cargar 10-15 plantillas iniciales.
- Crear grid, filtros y botón que rellene el generador.

### Día 7 — Calidad

- Estados de carga, errores y estados vacíos.
- Atajos: Ctrl/Cmd+Enter para generar; Ctrl/Cmd+S para guardar.
- Probar el flujo completo con 3-5 usuarios.

## Semana 2: valor añadido y lanzamiento

### Día 8 — Analizador

- Implementar `POST /analyze-code`.
- Devolver problemas, impacto, solución y código refactorizado.
- Mostrar diferencias de forma clara; no aplicar cambios automáticamente.

### Día 9 — Documentador

- Implementar `POST /generate-docs`.
- Soportar docstrings, comentarios y README.
- Vista previa Markdown y copia.

### Día 10 — Compartir y descargar

- Descargar snippets con extensión según lenguaje.
- Generar enlaces públicos con token aleatorio y solo lectura.

### Día 11 — Integración GitHub básica

- Diseñar la pantalla y preparar GitHub OAuth.
- Limitar inicialmente la integración a selección de repositorio y creación de issue tras confirmación explícita.

### Día 12 — Planes y seguridad

- Añadir contador de generaciones gratuito diario.
- Preparar página de precios sin cobros reales, o integrar proveedor de pagos solo si está validado.
- Revisar RLS, rate limits, logs y tratamiento de secretos.

### Día 13 — Despliegue

- Desplegar frontend en Vercel o Netlify.
- Desplegar API en Railway o Render.
- Configurar variables, CORS, dominio y pruebas de producción.

### Día 14 — Lanzamiento

- Corregir incidencias críticas.
- Publicar landing, demo y formulario de feedback.
- Medir registros, generaciones, guardados y retorno a 7 días.

## Métricas iniciales

- 100 usuarios activos durante el primer mes.
- 500 generaciones en las primeras dos semanas.
- Retención: usuarios que vuelven tres veces durante su primera semana.
- Conversión a Pro: objetivo inicial a validar, no una garantía.
