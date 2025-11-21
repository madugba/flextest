# Optimized multi-stage build using Next.js standalone output
# This approach is 3-5x faster and produces smaller images

FROM node:22-alpine AS deps

# Install dependencies for native modules
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy only package files first for better layer caching
COPY package.json package-lock.json* ./

# Use BuildKit cache mount for npm cache (speeds up subsequent builds significantly)
RUN --mount=type=cache,target=/root/.npm \
    npm ci --legacy-peer-deps --prefer-offline

FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy package files
COPY package.json package-lock.json* ./

# Copy only necessary source files (exclude test files, docs, etc. via .dockerignore)
COPY next.config.ts tsconfig.json ./
COPY public ./public
COPY src ./src

# Copy environment files if they exist
COPY .env.local* .env.docker* ./

# Set environment variables for optimized Docker build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
# Skip type checking and linting during Docker build (do these in CI separately)
ENV SKIP_TYPE_CHECK=true
ENV SKIP_LINT=true

# Build with cache mount for .next directory (speeds up rebuilds)
# Standalone output mode creates a minimal build in .next/standalone
# Using build:docker script which skips type checking and linting
RUN --mount=type=cache,target=/app/.next/cache \
    npm run build:docker

FROM node:22-alpine AS runner

WORKDIR /app

# Install only required runtime dependencies
RUN apk add --no-cache \
    libc6-compat \
    dumb-init

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3001

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser

# Copy the standalone build from builder
# This includes only the necessary files and dependencies
COPY --from=builder --chown=appuser:nodejs /app/.next/standalone ./
COPY --from=builder --chown=appuser:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=appuser:nodejs /app/public ./public

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3001', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)}).on('error', () => process.exit(1))"

# Use dumb-init to handle signals properly
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Start the standalone server (no npm needed!)
CMD ["node", "server.js"]