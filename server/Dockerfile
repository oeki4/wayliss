FROM node:22.16.0-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the NestJS application
RUN npm run prisma:generate
RUN npm run build

FROM node:22.16.0-alpine AS deploy

WORKDIR /app
COPY --from=build /app/.env ./
COPY --from=build /app/prisma ./prisma/
COPY --from=build /app/package*.json ./
COPY --from=build /app/dist/ ./dist/
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/generated ./generated/

EXPOSE 3001

CMD ["node", "dist/main.js"]