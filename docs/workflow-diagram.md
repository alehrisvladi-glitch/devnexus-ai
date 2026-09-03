# 📊 Diagrama Visual del Workflow

## 🔁 Flujo Completo

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           WORKFLOW DE AUTOMATIZACION                            │
│                         GitHub → Pipedream → Netlify + Email                    │
└─────────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   GITHUB     │     │  PIPEDREAM   │     │   NETLIFY    │     │    EMAIL     │
│   ACTIONS    │────▶│   WORKFLOW   │────▶│    DEPLOY    │────▶│ NOTIFICATION │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
       │                    │                    │                    │
       │                    │                    │                    │
  1. Push a main      2. Webhook        3. Deploy         4. Email
  2. Trigger YAML     recibe payload    automatico        enviado con
  3. Envia JSON       3. Procesa        4. Site live      detalles del
     con info del        steps                              commit
     commit           4. Llama a
                        Netlify API
                        + Send Email


┌─────────────────────────────────────────────────────────────────────────────────┐
│                         DETALLE DEL PAYLOAD JSON                                │
└─────────────────────────────────────────────────────────────────────────────────┘

{
  "event": "push",
  "repository": "alehrisvladi-glitch/devnexus-ai",
  "branch": "main",
  "commit_sha": "abc123def456...",
  "commit_message": "Fix: update landing page styles",
  "author": "alehrisvladi-glitch",
  "timestamp": "2026-09-03T07:00:00+00:00"
}


┌─────────────────────────────────────────────────────────────────────────────────┐
│                         EMAIL DE NOTIFICACION (EJEMPLO)                         │
└─────────────────────────────────────────────────────────────────────────────────┘

Asunto: ✅ Deploy completado: alehrisvladi-glitch/devnexus-ai

────────────────────────────────────────────────────────────────────────────────

🚀 Deploy Autom completado

Repositorio:    alehrisvladi-glitch/devnexus-ai
Branch:         main
Commit:         abc123def456...
Mensaje:        Fix: update landing page styles
Autor:          alehrisvladi-glitch
Timestamp:      2026-09-03T07:00:00+00:00

[Ver commit en GitHub]  [Ver sitio en Netlify]

────────────────────────────────────────────────────────────────────────────────
Enviado por Pipedream Automation


┌─────────────────────────────────────────────────────────────────────────────────┐
│                         CONFIGURACION EN GITHUB                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

Settings → Secrets and variables → Actions → New repository secret

┌──────────────────────────────────────────────────────────────────────────────┐
│ Name:  PIPEDREAM_WEBHOOK_URL                                                 │
│ Value: https://e123456789.m.pipedream.net                                    │
└──────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────────┐
│                         STEPS EN PIPEDREAM                                      │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Step 1: HTTP / Webhook → Catch Hook                                         │
│ URL: https://e123456789.m.pipedream.net                                     │
└─────────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Step 2: Netlify → Deploy Site                                               │
│ - Connect Netlify account (OAuth)                                           │
│ - Select site: "devnexus-ai"                                                │
│ - Deploy message: "Auto-deploy from GitHub: {{commit_message}}"             │
└─────────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Step 3: Email → Send Email                                                  │
│ - To: tu-email@ejemplo.com                                                  │
│ - Subject: "✅ Deploy completado: {{repository}}"                            │
│ - Body: HTML template con detalles del commit                               │
└─────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────────┐
│                         ARCHIVOS CREADOS EN TU REPO                             │
└─────────────────────────────────────────────────────────────────────────────────┘

✅ .github/workflows/pipedream-auto-deploy.yml  (workflow de GitHub Actions)
✅ docs/pipedream-workflow-code.md              (instrucciones paso a paso)
✅ docs/workflow-diagram.md                     (este archivo - diagrama visual)


┌─────────────────────────────────────────────────────────────────────────────────┐
│                         COMANDOS UTILES                                         │
└─────────────────────────────────────────────────────────────────────────────────┘

# Probar workflow manualmente desde CLI:
gh workflow run pipedream-auto-deploy.yml --repo alehrisvladi-glitch/devnexus-ai

# Ver logs del workflow:
gh run list --repo alehrisvladi-glitch/devnexus-ai --workflow=pipedream-auto-deploy.yml

# Ver ejecuciones en Pipedream:
https://e123456789.m.pipedream.net/executions


────────────────────────────────────────────────────────────────────────────────
**Creado:** 2026-09-03  
**Repo:** alehrisvladi-glitch/devnexus-ai  
**Autor:** @alehrisvladi-glitch
────────────────────────────────────────────────────────────────────────────────
