# Base stage for shared dependencies
FROM node:18-alpine AS base

# Install system dependencies
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    nodejs \
    yarn

# Install MinIO client
RUN wget https://dl.min.io/client/mc/release/linux-amd64/mc && \
    chmod +x mc && \
    mv mc /usr/local/bin/

# Development stage
FROM base AS development

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Production build stage
FROM base AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM base AS production

WORKDIR /app

# Copy built assets
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Environment variables for MinIO
ENV MINIO_ROOT_USER=minioadmin \
    MINIO_ROOT_PASSWORD=minioadmin \
    MINIO_PORT=9000 \
    MINIO_CONSOLE_PORT=9001

# Create data directory for MinIO
RUN mkdir -p /data

# Add startup script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000 9000 9001

ENTRYPOINT ["docker-entrypoint.sh"]
