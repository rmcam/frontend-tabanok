# Usa una imagen base de Node.js para la construcción
FROM node:20-alpine AS build

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de configuración de pnpm y package.json
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Instala pnpm globalmente
RUN npm install -g pnpm

# Instala las dependencias del proyecto
RUN pnpm install --frozen-lockfile

# Copia el resto del código fuente de la aplicación
COPY . .

# Construye la aplicación para producción
RUN pnpm build

# Usa una imagen base ligera para servir la aplicación
FROM nginx:alpine

# Copia los archivos de construcción de la etapa anterior al directorio de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expone el puerto 80 para el servidor web
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
