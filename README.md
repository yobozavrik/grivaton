# Operator Webhook Trigger

Минимальное WebApp-приложение на Next.js, которое отправляет POST-запрос на n8n webhook через серверный роут `/api/trigger`.

## Environment variables

`N8N_WEBHOOK_URL` обязателен и должен быть задан в окружении Vercel.

```bash
# test
N8N_WEBHOOK_URL=http://localhost:5678/webhook-test/graviton

# prod
# N8N_WEBHOOK_URL=http://localhost:5678/webhook/graviton
```

Если переменная не задана, `/api/trigger` вернет ошибку 500 с текстом `N8N_WEBHOOK_URL is not set`.
