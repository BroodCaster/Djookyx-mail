FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --force

FROM node:20-alpine AS runner

WORKDIR /app

COPY .env .env

COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 8080

CMD ["npm", "run", "start"]
