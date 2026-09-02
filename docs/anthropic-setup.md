# Configuracion de Anthropic (Claude)

## 1. Obtener API Key

1. Ve a https://console.anthropic.com
2. Inicia sesion o crea una cuenta.
3. En API Keys, crea una nueva clave.
4. Copia la clave y guardala en un lugar seguro.

## 2. Configurar el backend

1. Copia `.env.example` a `.env` en la carpeta `backend`:
   ```bash
   cd backend
   cp .env.example .env
   ```
2. Edita `.env` y anade tu clave:
   ```env
   ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ANTHROPIC_MODEL=claude-sonnet-4-5-20250929
   ```

## 3. Modelos recomendados

- `claude-sonnet-4-5-20250929`: excelente equilibrio entre calidad y velocidad para codigo.
- `claude-opus-4-5-20250929`: mas potente, ideal para tareas complejas o refactorizaciones grandes.
- `claude-haiku-4-5-20250929`: rapido y economico para iteraciones rapidas.

## 4. Reiniciar el servidor

```bash
uvicorn main:app --reload --port 8000
```

## 5. Verificacion

Abre http://localhost:8000/health y comprueba que `ai_provider` sea `anthropic`.

## Buenas practicas

- **No exponer la API key**: nunca la subas a GitHub ni la uses en el frontend.
- **Rate limits**: consulta los limites en el dashboard de Anthropic y anade reintentos con backoff si es necesario.
- **Manejo de errores**: el backend ya envia 502 si la llamada falla; en produccion, registra los errores sin guardar datos sensibles.
- **Costes**: monitoriza el uso en el dashboard para evitar sorpresas.

## Prueba rapida

1. Abre http://localhost:5173
2. Escribe: `Crea una funcion en Python que lea un CSV y filtre filas por columna`
3. Pulsa `Generar codigo` y revisa el resultado.
