# ===== Build Stage =====
FROM node:20-alpine AS build
WORKDIR /app

# Cache dependencies first
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source and build
# Set API base to empty string so frontend uses relative URLs (Nginx will proxy /api to backend)
COPY . .
ENV VITE_API_BASE_URL=""
RUN npm run build

# ===== Runtime Stage =====
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy built assets and nginx config
COPY --from=build /app/dist .
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
