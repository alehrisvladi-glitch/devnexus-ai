# 🤖 Workflow de Pipedream: GitHub → Netlify + Email

## 📋 Descripción
Este workflow se activa cuando recibe un webhook de GitHub Actions y:
1. **Despliega automáticamente** tu sitio a Netlify
2. **Envia un email** de notificacion con los detalles del deploy

---

## 🔧 Paso 1: Crear nuevo workflow en Pipedream

1. Ve a [Pipedream.com](https://pipedream.com) → **"Create"** → **"Workflow"**
2. Elige **"HTTP / Webhook"** como trigger
3. Selecciona **"Catch Hook"** (HTTP webhook)
4. Copia la URL del webhook (ej: `https://e123456789.m.pipedream.net`)

---

## 🔧 Paso 2: Configurar GitHub Secret

En tu repo de GitHub:
1. Ve a **Settings** → **Secrets and variables** → **Actions**
2. Click en **"New repository secret"**
3. Nombre: `PIPEDREAM_WEBHOOK_URL`
4. Valor: (la URL de tu webhook de Pipedream)
5. Click **"Add secret"**

---

## 🔧 Paso 3: Añadir steps al workflow de Pipedream

### Step 1: HTTP Webhook (ya creado)
- **App:** `HTTP / Webhook`
- **Event:** `Catch Hook`
- **URL:** `https://e123456789.m.pipedream.net`

### Step 2: Desplegar a Netlify
- Click **"+"** → **"Add step"**
- Busca **"Netlify"**
- Elige **"Deploy Site"**
- Conecta tu cuenta de Netlify (OAuth)
- Configura:
  - **Site:** (selecciona tu sitio de Netlify)
  - **Build Hook URL:** (opcional, si usas build hooks)
  - **Deploy message:** `Auto-deploy from GitHub: {{steps.trigger.event.payload.commit_message}}`

### Step 3: Enviar email de notificacion
- Click **"+"** → **"Add step"**
- Busca **"Email"** (o **"Gmail"** si prefieres)
- Elige **"Send Email"**
- Configura:
  - **To:** `tu-email@ejemplo.com`
  - **From:** `Pipedream Automation <noreply@pipedream.net>`
  - **Subject:** `✅ Deploy completado: {{steps.trigger.event.payload.repository}}`
  - **Body (HTML):**

```html
<h2>🚀 Deploy Autom completado</h2>

<table>
  <tr><td><strong>Repositorio:</strong></td><td>{{steps.trigger.event.payload.repository}}</td></tr>
  <tr><td><strong>Branch:</strong></td><td>{{steps.trigger.event.payload.branch}}</td></tr>
  <tr><td><strong>Commit:</strong></td><td><code>{{steps.trigger.event.payload.commit_sha}}</code></td></tr>
  <tr><td><strong>Mensaje:</strong></td><td>{{steps.trigger.event.payload.commit_message}}</td></tr>
  <tr><td><strong>Autor:</strong></td><td>{{steps.trigger.event.payload.author}}</td></tr>
  <tr><td><strong>Timestamp:</strong></td><td>{{steps.trigger.event.payload.timestamp}}</td></tr>
</table>

<p><a href="https://github.com/{{steps.trigger.event.payload.repository}}">Ver commit en GitHub</a></p>
<p><a href="https://app.netlify.com/sites/tu-sitio">Ver sitio en Netlify</a></p>

<hr>
<p><em>Enviado por Pipedream Automation</em></p>
```

---

## 🔧 Paso 4: Probar el workflow

1. En Pipedream, click **"Test"** en el trigger
2. En GitHub, haz un pequeño cambio en tu repo y haz push a `main`
3. Verifica en Pipedream que el workflow se ejecutó³ºº
4. Revisa tu email para la notificacion
5. Verifica en Netlify que el deploy se completó³ºº

---

## 📊 Diagrama del flujo

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐      ┌─────────────┐
│   GitHub    │ ───► │  Pipedream   │ ───► │   Netlify   │ ───► │   Email     │
│   (push)    │      │  (webhook)   │      │   (deploy)  │      │ (notificar) │
└─────────────┘      └──────────────┘      └─────────────┘      └─────────────┘
```

---

## 🔐 Variables de entorno recomendadas

En Pipedream (Settings → Environment variables):
- `NETLIFY_SITE_ID`: (tu site ID de Netlify)
- `DEPLOY_EMAIL`: (email para notificaciones)

---

## 🛠️ Troubleshooting

| Problema | Solucion |
|----------|----------|
| Webhook no se dispara | Verifica que `PIPEDREAM_WEBHOOK_URL` esté en secrets |
| Deploy falla en Netlify | Revisa permisos de la cuenta conectada |
| Email no llega | Verifica spam folder o usa Gmail step |
| Workflow no se ejecuta | Revisa logs en Pipedream ("Executions" tab) |

---

## 📚 Recursos adicionales

- [Docs de GitHub Actions](https://docs.github.com/es/actions)
- [Docs de Pipedream](https://pipedream.com/docs)
- [Docs de Netlify](https://docs.netlify.com)
- [Ejemplos de workflows](https://pipedream.com/apps/github/workflows)

---

**Creado:** 2026-09-03  
**Repo:** `alehrisvladi-glitch/devnexus-ai`  
**Autor:** @alehrisvladi-glitch
