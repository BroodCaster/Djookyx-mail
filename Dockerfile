FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm i -force

FROM node:20-alpine AS runner

WORKDIR /app

COPY . .

COPY .env .env

EXPOSE 8080

RUN npm run start
