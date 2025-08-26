# MusiGram — Step 1 (Core)
**Inclui**: Auth (registro/login/me), perfis, seguir/deixar de seguir, posts com upload de áudio/capa, feed, curtir/comentar, explorar (trending e #hashtag), client React simples.

## Como rodar
### API
```bash
cd server
cp .env.example .env
npm install
npm run dev
```
API em http://localhost:4000

### Web
```bash
cd client
echo "VITE_API_BASE=http://localhost:4000/api" > .env
npm install
npm run dev
```
App em http://localhost:5173


## Step 2 — Comunicação & Notificações
Inclui:
- Mensagens diretas (DM): inbox, chat e envio.
- Notificações em tempo real via Socket.IO (follow e DM).
- Sinos de notificação (badge) no client.

### Após baixar este pacote
- No **server**: `npm install` (novas deps: socket.io)
- No **client**: `npm install` (nova dep: socket.io-client)
- Rodar igual ao Step 1.


## Step 3 — Stories, Salvos e Playlists
Inclui:
- Stories (24h, imagem + legenda).
- Salvar posts e ver lista de salvos.
- Playlists (criar, listar, adicionar/remover posts).
Novas rotas no client: /stories, /saves, /playlists


## Step 4 — Segurança, Moderação & Admin
- Filtro de palavrões em posts e comentários.
- Reports: POST /api/mod/report e painel /admin (client) com ações.
- Ban/shadowban de usuários; middleware bloqueia banidos.
- Rate limiting global (300 req/min por IP).
### Como ativar Admin
- Edite `server/data/db.json`, encontre seu usuário e defina `"isAdmin": true`.
- Reinicie a API. O link **Admin** aparece na navbar.


## Step 5 — Produção & Extras
Inclui:
- Verificação de e-mail (link) e reset de senha (token simples).
- Logs com Winston + `/metrics` (Prometheus).
- Web Push (VAPID) com rotas `/api/push/subscribe` e `/api/push/test`.
- Storage local/S3 configurável via `.env`.
- PWA: `manifest.webmanifest` + `sw.js` e registro automático.
- Dockerfiles (server/client) + `docker-compose.yml` + Nginx.

### Dicas rápidas
- **Admin URL**: `/admin` (marque seu usuário `isAdmin: true` em `server/data/db.json`).
- **VAPID**: gere chaves e preencha `.env`. Sem isso, o push só não dispara (não quebra).
- **S3**: defina `STORAGE_DRIVER=s3` e variáveis S3 para enviar mídia ao bucket.
- **Prometheus**: scrape `http://localhost:4000/metrics`.
- **Docker**: `docker compose up --build` (expondo 8080 com Nginx).


## Step 6 — Monetização & CI
Inclui:
- Stripe: gorjetas (Checkout) e assinatura (monthly/yearly). Rotas:
  - POST `/api/payments/create-checkout-session` `{ amount }` (centavos)
  - POST `/api/payments/create-subscription-session` `{ plan: 'monthly'|'yearly' }`
  - POST `/api/payments/webhook` (use endpoint da Stripe)
- Ads Manager:
  - Admin: GET `/api/admin/ads`, POST `/api/admin/ads`, POST `/api/admin/ads/:id/toggle`
  - Público: GET `/api/ads/feed`
- Client:
  - `/support` (gorjetas), `/pro` (assinatura), `/admin/ads` (gerir anúncios).
- CI:
  - GitHub Actions: `.github/workflows/ci.yml` instala server e builda o client.

### Configurar Stripe
- Defina no `.env` do server:
```
STRIPE_SECRET_KEY=sk_live_ou_test
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_MONTHLY=price_xxx
STRIPE_PRICE_YEARLY=price_yyy
APP_PUBLIC_URL=http://localhost:5173
```
- Crie o endpoint de webhook na Stripe apontando para: `/api/payments/webhook`.
- Em dev, use `stripe listen --forward-to localhost:4000/api/payments/webhook`.

### Observações
- `isPro` é setado no webhook em `checkout.session.completed` para sessões de assinatura.
- Ads são simples (budget/impressões), sem cobrança; servem de base para evoluir.


## Step 7 — Dev UX (Tests, Storybook, Demo Data)
Inclui:
- **Tests (Vitest)** no server para utilidades (`extractTags`, `hasProfanity`).
- **Seed de demonstração**: `node src/utils/seed.js` (cria usuários, posts, stories, playlists, ads).
- **Storybook** no client: `npm run storybook` (porta 6006) + exemplos de PostCard/NavBar.
- **CI atualizado**: roda testes do server e builda o Storybook.

### Comandos úteis
- **Server tests**: `cd server && npm install && npm test`
- **Seed demo**: `cd server && node src/utils/seed.js`
- **Storybook**: `cd client && npm install && npm run storybook`
