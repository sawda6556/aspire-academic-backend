# Stage 1: Build
FROM node:20 AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Run
FROM node:20

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
# Using --include=dev might be safer if some build tools are needed, 
# but --omit=dev is what was requested for the runner stage.
RUN npm install --omit=dev

# Copy built assets from builder
COPY --from=builder /app/dist ./dist

# Create uploads directory and subdirectories
RUN mkdir -p uploads/messages uploads/resources uploads/verification

# Set environment variables
ENV NODE_ENV=production
ENV ALLOW_DEGRADED_MODE=true

# Explicitly expose the port (Railway uses PORT env var)
EXPOSE 8080

# Start the application
CMD ["node", "dist/main"]
