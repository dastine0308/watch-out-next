# multi-stage Dockerfile for Next.js application

# stage 1: install dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# copy dependency files
COPY package.json package-lock.json* ./
RUN npm ci

# stage 2: build application
FROM node:20-alpine AS builder
WORKDIR /app

# copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# set environment variables
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# build Next.js application
RUN npm run build

# stage 3: runtime
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/server.ts ./
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./
COPY --from=builder /app/tsconfig.json ./

# install tsx and necessary dependencies (for running TypeScript server.ts)
RUN npm install --production --no-save tsx typescript

# set permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

# expose port
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
# Note: NODE_TLS_REJECT_UNAUTHORIZED should only be set to 0 in development
# For production, set it via docker-compose.yml or environment variables if needed

# start application (using tsx to run TypeScript)
CMD ["npx", "tsx", "server.ts"]

