ARG NX_CLOUD_ACCESS_TOKEN

# Base Image
FROM node:lts-bullseye-slim AS base
ARG NX_CLOUD_ACCESS_TOKEN

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable pnpm && corepack prepare pnpm --activate

# Install MinIO client
RUN apt-get update && apt-get install -y wget \
    && wget https://dl.min.io/client/mc/release/linux-amd64/mc \
    && chmod +x mc \
    && mv mc /usr/local/bin/ \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Build Image
FROM base AS build
ARG NX_CLOUD_ACCESS_TOKEN

COPY .npmrc package.json pnpm-lock.yaml ./
COPY ./tools/prisma /app/tools/prisma
RUN pnpm install --frozen-lockfile

COPY . .

ENV NX_CLOUD_ACCESS_TOKEN=$NX_CLOUD_ACCESS_TOKEN

RUN pnpm run build

# Release Image
FROM base AS release

RUN apt-get update && apt-get install -y dumb-init --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

COPY --chown=node:node --from=build /app/.npmrc /app/package.json /app/pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

COPY --chown=node:node --from=build /app/dist ./dist
COPY --chown=node:node --from=build /app/tools/prisma ./tools/prisma
RUN pnpm run prisma:generate

# Create data directory for MinIO
RUN mkdir -p /data

# Environment variables
ENV TZ=UTC \
    PORT=3000 \
    NODE_ENV=production \
    MINIO_ROOT_USER=minioadmin \
    MINIO_ROOT_PASSWORD=minioadmin \
    MINIO_PORT=9000 \
    MINIO_CONSOLE_PORT=9001

# Add startup script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000 9000 9001

ENTRYPOINT ["docker-entrypoint.sh"]
