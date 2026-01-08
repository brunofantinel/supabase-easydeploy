# Estágio 1: Build (Gera a pasta dist)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Estágio 2: Produção (Servidor Nginx)
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Agora o "from=builder" funciona porque definimos o estágio acima
COPY --from=builder /app/dist .
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Script para injetar as chaves do Supabase em runtime
RUN mkdir -p /docker-entrypoint.d && \
    printf '#!/bin/sh\n\
set -e\n\
cat > /usr/share/nginx/html/env.js <<EOF\n\
window.__ENV__ = {\n\
  VITE_SUPABASE_URL: "$VITE_SUPABASE_URL",\n\
  VITE_SUPABASE_ANON_KEY: "$VITE_SUPABASE_ANON_KEY"\n\
};\n\
EOF\n\
' > /docker-entrypoint.d/99-env.sh && chmod +x /docker-entrypoint.d/99-env.sh

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
