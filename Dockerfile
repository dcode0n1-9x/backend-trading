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
COPY src ./src

# Set build-time env (aligns with production)
ENV NODE_ENV=production
ENV BUN_ENV=production

# Optional: Run migrations during build if schema is stable (avoids runtime issues)
# Uncomment if you want migrations baked in; otherwise, handle via entrypoint script
# RUN bunx prisma db push  # Or migrate deploy for existing DB

# Compile to standalone binary (use --target bun for Bun runtime compatibility)
RUN bun build \
    --compile \
    --target bun \
    --minify \
    --outfile /app/server \
    src/index.ts  # Adjust to src/server.ts if that's your clustering/entry point

# Production stage: Distroless for minimal footprint (no shell, secure)
FROM gcr.io/distroless/base-debian12

WORKDIR /app

# Copy the compiled binary
COPY --from=build /app/server ./server

# Expose app port
EXPOSE 3000

# Health check: Assumes your app exposes a /health endpoint (e.g., via Express/Fastify)
# This integrates with compose healthcheck; adjust command if no HTTP health
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Run the binary (non-root user for security if Distroless supports; otherwise, add USER 1000)
CMD ["./server"]
