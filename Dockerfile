# Etapa de construcción
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Copiar archivos de dependencias y instalar
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copiar el resto del código fuente
COPY . .

# Construir la aplicación
RUN pnpm build

# Etapa de servicio
FROM nginx:alpine

# Copiar los archivos construidos desde la etapa de construcción
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
