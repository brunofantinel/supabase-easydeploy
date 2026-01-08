# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Production
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create entrypoint script for runtime env injection
RUN printf '#!/bin/sh\n\
set -e\n\
cat > /usr/share/nginx/html/env.js <<EOF\n\
window.__ENV__ = {\n\
  VITE_SUPABASE_URL: "__VITE_SUPABASE_URL__",\n\
  VITE_SUPABASE_ANON_KEY: "__VITE_SUPABASE_ANON_KEY__"\n\
};\n\
EOF\n\
sed -i "s|__VITE_SUPABASE_URL__|${VITE_SUPABASE_URL:-}|g" /usr/share/nginx/html/env.js\n\
sed -i "s|__VITE_SUPABASE_ANON_KEY__|${VITE_SUPABASE_ANON_KEY:-}|g" /usr/share/nginx/html/env.js\n\
' /docker-entrypoint.d/99-env.sh && chmod +x /docker-entrypoint.d/99-env.sh

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
