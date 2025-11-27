# Build stage: Use specific Bun version for reproducibility
FROM oven/bun:latest AS build

WORKDIR /app


RUN apt-get update -y && apt-get install -y openssl
# RUN apk add --no-cache python3 make g++ pkgconfig pixman-dev cairo-dev pango-dev libjpeg-turbo-dev giflib-dev openssl

# Copy package files for dependency caching
COPY package.json bun.lock* ./

# Install all deps (including dev for Prisma/tools)
RUN bun install

# Copy Prisma schema and generate client (requires dev deps)
COPY prisma ./prisma


COPY prisma.config.* ./

# --- NEW: build arg + env ---
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

RUN bunx prisma generate

# Copy source code
COPY ./src ./src


# Set build-time env (aligns with production)
ENV BUN_ENV=production

RUN bun build \
    --compile \
    --minify-whitespace \
    --minify-syntax \
    --target bun \
    --outfile server \
    src/server.ts

# Production stage: Distroless for minimal footprint (no shell, secure)
FROM gcr.io/distroless/base


# Copy the compiled binary
COPY --from=build /app/server .

ENV BUN_ENV=development

CMD ["./server"]


EXPOSE 3000