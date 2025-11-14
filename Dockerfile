# Build stage: Use specific Bun version for reproducibility
FROM oven/bun:1.1 AS build

WORKDIR /app

# Copy package files for dependency caching
COPY package.json bun.lock* ./

# Install all deps (including dev for Prisma/tools)
RUN bun install

# Copy Prisma schema and generate client (requires dev deps)
COPY prisma ./prisma
RUN bunx prisma generate

# Copy source code
COPY ./src ./src


# Set build-time env (aligns with production)
ENV NODE_ENV=production

RUN bun build \
    --compile \
    --minify-whitespace \
    --minify-syntax \
    --target bun \
    --outfile server \
    src/server.ts

# Production stage: Distroless for minimal footprint (no shell, secure)
FROM gcr.io/distroless/base


WORKDIR /app

# Copy the compiled binary
COPY --from=build /app/server server

ENV NODE_ENV=production

CMD ["/app/server"]


EXPOSE 3000

