# Wireframe de DevNexus AI

## 1. Landing y onboarding

- Logo DevNexus AI, mensaje: "Escribe, entiende y mejora código con IA".
- CTA principal: `Empezar gratis`.
- Beneficios: generar código, documentar proyectos, depurar errores.
- Accesos a plantillas, precios e inicio de sesión.

## 2. Inicio de la app

- Header: logo, buscador de plantillas, contador de uso y menú de perfil.
- Sidebar: Inicio, Generar, Depurar, Documentar, Plantillas, Historial, Favoritos y Perfil.
- Área principal: caja grande con la pregunta `¿Qué quieres programar hoy?`.
- Tarjetas de acceso rápido: Componente React, API REST, Script Python y Consulta SQL.

## 3. Generador de código

- Campo de descripción de la tarea.
- Selector de lenguaje: JavaScript, TypeScript, Python, HTML/CSS, SQL y otros.
- Selector opcional de framework: React, Express, FastAPI, etc.
- Acordeón avanzado: nivel, estilo (PEP8/Airbnb/estándar), formato y requisitos.
- Botón `Generar código`.
- Resultado en Monaco Editor con pestañas: Código, Explicación, Tests y Documentación.
- Acciones: copiar, guardar, descargar, compartir, optimizar, generar tests y generar README.

## 4. Depurador

- Editor para pegar código o cargar un archivo permitido.
- Selector de lenguaje y botón `Analizar código`.
- Resultado: errores, causa, solución propuesta, mejoras y diff de refactorización.
- Acciones: copiar la corrección y guardar nueva versión.

## 5. Documentador

- Editor de código y selector: docstrings, comentarios inline o README.
- Botón `Generar documentación`.
- Vista previa Markdown y descarga `.md`.

## 6. Plantillas

- Cuadrícula con categorías: Frontend, Backend, Bases de datos, APIs, Scripts y DevOps.
- Filtros por lenguaje, framework y tipo de salida.
- Vista de detalle con explicación, ejemplo y botón `Usar plantilla`.

## 7. Historial y favoritos

- Lista con título, lenguaje, framework, fecha y estado de favorito.
- Búsqueda, filtros y acciones: abrir, duplicar, descargar o eliminar.

## 8. Perfil

- Cuenta, plan, preferencias por defecto y atajos de teclado.
- Botón de conexión con GitHub para una fase posterior.

## Flujo principal

1. El usuario escribe una necesidad, por ejemplo: `Crea un componente React de lista de usuarios con búsqueda y filtro`.
2. Selecciona TypeScript y React.
3. La IA devuelve código, explicación y sugerencias de tests.
4. El usuario revisa en el editor, copia o guarda el snippet.
