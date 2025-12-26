# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy everything
COPY . .

# Remove lock files and node_modules, then clean install for Alpine
RUN rm -rf package-lock.json client/package-lock.json node_modules client/node_modules server/node_modules

# Clean install - this will properly resolve Alpine ARM64 musl dependencies
RUN npm install

# Build
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy built artifacts from builder
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/client/dist ./client/dist
COPY --from=builder /app/shared ./shared

# Copy node_modules from ROOT (workspace installs here)
COPY --from=builder /app/node_modules ./node_modules

# Create directory for database (relative to compiled code location)
RUN mkdir -p /app/server/dist/server/data

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Set working directory to server
WORKDIR /app/server

# Start server
CMD ["node", "dist/server/src/server.js"]
