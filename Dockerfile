# ── Stage 1: Build ──────────────────────────────────────────────────────────
FROM node:20-slim AS builder

WORKDIR /app


# Install openssl (required by Prisma engine)
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*



# Copy package files
COPY package*.json ./


# Install ALL dependencies (including devDeps needed for build)
RUN npm install

# Copy source
COPY . .

# Generate Prisma client for debian-openssl target
RUN npx prisma generate

# Build NestJS app
RUN npm run build

# ── Stage 2: Production ──────────────────────────────────────────────────────
FROM node:20-slim AS production

WORKDIR /app

# Install openssl runtime (required by Prisma engine at runtime)
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm install --omit=dev

# Copy built dist from builder
COPY --from=builder /app/dist ./dist

# Copy generated Prisma client
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy prisma schema (needed at runtime)
COPY --from=builder /app/src/prisma ./src/prisma

EXPOSE 5000

CMD ["node", "dist/main"]
