FROM node:20-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

# Establecer la variable de entorno VITE_API_URL antes del build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN pnpm build


FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
