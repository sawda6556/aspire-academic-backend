# Builder stage
FROM node:20 AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Remove development dependencies to keep the image small
RUN npm prune --production

# Runner stage
FROM node:20 AS runner

WORKDIR /app

# Copy package files (for reference)
COPY package*.json ./

# Copy node_modules from builder (they are already pruned)
COPY --from=builder /app/node_modules ./node_modules

# Copy the compiled application from the builder stage
COPY --from=builder /app/dist ./dist

# Create uploads directory and subdirectories to ensure they exist
RUN mkdir -p uploads/messages uploads/resources uploads/verification

# Set environment variables
ENV NODE_ENV=production
ENV ALLOW_DEGRADED_MODE=true

# Start the application
CMD ["node", "dist/main"]
