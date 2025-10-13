# Базовый образ Node.js
FROM node:22.16.0-alpine

# Рабочая директория внутри контейнера
WORKDIR /usr/src/app

# Копируем package.json и lock-файл
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь остальной код
COPY . .

# Генерируем Prisma Client (однократно при сборке)
RUN npx prisma generate

# Открываем порт NestJS
EXPOSE 3000

# При запуске контейнера:
# 1️⃣ Применяем миграции (использует DATABASE_URL из ENV)
# 2️⃣ Генерируем Prisma client (на случай изменения схемы)
# 3️⃣ Запускаем NestJS в режиме разработки
CMD sh -c "npx prisma migrate deploy && npx prisma generate && npm run start:dev"
