
FROM node:24-alpine AS build
WORKDIR /app

RUN corepack enable

# Copy package.json and your lockfile, here we add pnpm-lock.yaml for illustration
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . ./

# Build the project
RUN npm run build

# Build Stage 2

FROM node:24-alpine AS deploy
WORKDIR /app

# Only `.output` folder is needed from the build stage
COPY --from=build /app/.output/ ./

# Change the port and host

ENV PORT 3000
ENV HOST 0.0.0.0

EXPOSE 3000

CMD ["node", "/app/server/index.mjs"]