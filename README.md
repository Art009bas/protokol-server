# Протокол Планёрок — Сервер

Готовый сервер на Express с авторизацией, базой PostgreSQL и API для планёрок.

## 🚀 Развёртывание на Render

### 1. Загрузите код на GitHub
- Создайте репозиторий, загрузите туда файлы из архива.

### 2. Создайте базу данных
- Render → New PostgreSQL → Internal DB → скопируйте DATABASE_URL

### 3. Запуск сервера
- Render → New Web Service → подключите GitHub
- Build Command: `npm install && npx prisma generate && npx prisma migrate deploy`
- Start Command: `node server.js`
- Environment:
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `PORT=4000`

API будет доступно на вашем URL.
