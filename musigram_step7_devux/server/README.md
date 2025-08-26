# MusiGram API — Step 1 (Core)

## Rodar
```bash
cp .env.example .env
npm install
npm run dev
```
API: http://localhost:4000
Rotas: /api/auth, /api/users, /api/posts, /api/explore
Uploads locais em `/uploads`.


## Demo Seed
Crie dados de demonstração (users/posts/etc.) rodando:
```bash
node src/utils/seed.js
```
Login padrão dos usuários seed: **123456**.
Usuário admin: **admin@mg.local** (isAdmin: true)
