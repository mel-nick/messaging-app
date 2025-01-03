FROM node:16-alpine AS builder

WORKDIR /app/frontend

COPY . .

RUN npm install -g npm@9.8.0 && npm install

RUN npm install

RUN npm run build

# nginx
FROM nginx:latest AS prod

RUN addgroup --system nginxgroup && adduser --system --no-create-home --ingroup nginxgroup nginxuser

COPY --from=builder /app/frontend/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

RUN chown -R nginxuser:nginxgroup /usr/share/nginx /etc/nginx /var/cache/nginx /var/run /tmp
RUN chmod +x /usr/sbin/nginx

USER nginxuser

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
