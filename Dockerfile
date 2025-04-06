# Etapa de build
FROM node:18-alpine AS builder

WORKDIR /app

COPY pnpm-lock.yaml ./
COPY package.json ./
COPY . .

RUN npm install -g pnpm \
  && pnpm install --frozen-lockfile \
  && pnpm build

# Etapa de producción
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN npm install -g pnpm

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Instalar solo dependencias de producción
RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs

EXPOSE 3000

CMD ["pnpm", "start"]
