# Multi-stage Dockerfile for Next.js Frontend
# Optimized for production deployment

# ============================================
# Stage 1: Dependencies
# ============================================
FROM node:22-alpine AS deps

# Install dependencies for native modules
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install --legacy-peer-deps

# ============================================
# Stage 2: Builder
# ============================================
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Copy environment files (prioritize .env.local if exists, fallback to .env.docker)
COPY .env.local* .env.docker* ./

# Set environment variable for production build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build Next.js application
RUN npm run build


# ============================================
# Stage 3: Production Runner
# ============================================
FROM node:22-alpine AS runner

WORKDIR /app

# Install only required runtime dependencies
RUN apk add --no-cache \
    libc6-compat \
    dumb-init

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser

# Copy package files for npm start
COPY --from=builder --chown=appuser:nodejs /app/package.json ./package.json
COPY --from=builder --chown=appuser:nodejs /app/package-lock.json* ./

# Copy node_modules from builder
COPY --from=builder --chown=appuser:nodejs /app/node_modules ./node_modules

# Copy built application
COPY --from=builder --chown=appuser:nodejs /app/.next ./.next
COPY --from=builder --chown=appuser:nodejs /app/public ./public

# Copy Next.js config
COPY --from=builder --chown=appuser:nodejs /app/next.config.ts ./next.config.ts

# Copy environment files if they exist
COPY --from=builder --chown=appuser:nodejs /app/.env.local* ./
COPY --from=builder --chown=appuser:nodejs /app/.env.docker* ./

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3001', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)}).on('error', () => process.exit(1))"

# Use dumb-init to handle signals properly
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Start application with npm
CMD ["npm", "run", "start"]