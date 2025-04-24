# Etapa de build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages

# Usar Corepack para pnpm
RUN corepack enable && pnpm install --no-frozen-lockfile

# Copiar todo el directorio frontend
COPY frontend ./frontend

RUN pnpm --filter frontend build

# Etapa de producción: nginx para servir archivos estáticos
FROM nginx:alpine AS production

WORKDIR /usr/share/nginx/html

COPY --from=builder /app/frontend/dist .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
