# Estágio final com Nginx
FROM nginx:alpine

# Copia os arquivos buildados
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Cria o diretório caso ele não exista e gera o script de ambiente
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
