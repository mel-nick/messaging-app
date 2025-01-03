# Use an official Node.js runtime as the base image
FROM node:16-alpine AS builder

# Set the working directory in the container
WORKDIR /app/frontend

# Copy package.json and package-lock.json to the working directory
COPY . .

RUN npm install -g npm@9.8.0 && npm install

# Install dependencies
RUN npm install

# Build the React app
RUN npm run build

FROM nginx:latest AS prod

# Create a non-root user and group
RUN addgroup --system nginxgroup && adduser --system --no-create-home --ingroup nginxgroup nginxuser

COPY --from=builder /app/frontend/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

RUN chown -R nginxuser:nginxgroup /usr/share/nginx /etc/nginx /var/cache/nginx /var/run /tmp
RUN chmod +x /usr/sbin/nginx

USER nginxuser

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
