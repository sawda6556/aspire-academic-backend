# Builder stage
FROM node:20 AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies like @nestjs/cli)
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Runner stage
FROM node:20-slim AS runner

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy the compiled application from the builder stage
COPY --from=builder /app/dist ./dist

# Create uploads directory and subdirectories to ensure they exist
RUN mkdir -p uploads/messages uploads/resources uploads/verification

# Set environment variables
ENV NODE_ENV=production
ENV ALLOW_DEGRADED_MODE=true

# Start the application
# Using dist/main.js explicitly or dist/main both usually work for CommonJS
CMD ["node", "dist/main"]
