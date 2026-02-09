FROM node:20-alpine AS builder

WORKDIR /app

# Install OpenSSL and other dependencies for Prisma
RUN apk add --no-cache openssl openssl-dev libc6-compat

COPY package*.json ./
RUN npm ci --include=dev

COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS production

WORKDIR /app

# Install OpenSSL for Prisma runtime
RUN apk add --no-cache openssl libc6-compat

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

EXPOSE 3001

CMD ["npm", "run", "start:prod"]CMD ["node", "dist/main"]