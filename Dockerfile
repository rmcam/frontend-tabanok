# Etapa de build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

# Usar Corepack para pnpm
RUN corepack enable && pnpm install --no-frozen-lockfile

# Copiar el contenido del directorio src al directorio /app/frontend
COPY src ./frontend

RUN pnpm --filter frontend build

# Etapa de producción: nginx para servir archivos estáticos
FROM nginx:alpine AS production

WORKDIR /usr/share/nginx/html

COPY --from=builder /app/frontend/dist .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
