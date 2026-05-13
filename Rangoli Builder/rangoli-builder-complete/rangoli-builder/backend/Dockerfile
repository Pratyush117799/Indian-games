# ── Build stage ───────────────────────────────────────────────────────────────
FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies first (layer cache)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source
COPY src/ ./src/

# ── Production image ──────────────────────────────────────────────────────────
FROM node:20-alpine AS production
WORKDIR /app

# Non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S rangoli -u 1001
USER rangoli

COPY --from=base --chown=rangoli:nodejs /app ./

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', r => r.statusCode===200 ? process.exit(0) : process.exit(1))"

EXPOSE 5000
ENV NODE_ENV=production

CMD ["node", "src/app.js"]
