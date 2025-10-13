# Используем официальный Node образ
FROM node:22.16.0-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Установим зависимости, но не копируем весь код пока — чтобы воспользоваться кешем слоёв
COPY package*.json ./
# если вы используете pnpm/yarn, замените команду установки соответственно
RUN npm ci

# Копируем остальной код (копировать можно и при запуске через volume, но оставим для completeness)
COPY . .

# Экспортим порт Nuxt (по умолчанию 3000)
EXPOSE 3000

# Переменные для удобства разработки:
# CHOKIDAR_USEPOLLING=1 — включить polling watcher (полезно на Docker for Mac/Windows/WSL)
# HOST 0.0.0.0 — чтобы dev-сервер слушал на всех интерфейсах контейнера
ENV CHOKIDAR_USEPOLLING="true"
ENV HOST="0.0.0.0"
ENV PORT="3000"
ENV NODE_ENV="development"

# Команда запуска dev-сервера.
# Ожидается, что в package.json есть скрипт "dev": "nuxt dev --hostname 0.0.0.0 --port 3000"
CMD ["sh", "-c", "npm run dev"]
