FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm i -force

FROM node:20-alpine AS runner

WORKDIR /app

COPY .env .env

COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 8080

RUN npm run start
