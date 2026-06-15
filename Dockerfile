FROM node:20

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Create uploads directory and subdirectories to ensure they exist
RUN mkdir -p uploads/messages uploads/resources uploads/verification

# Set environment variables
ENV NODE_ENV=production
ENV ALLOW_DEGRADED_MODE=true

# Explicitly expose the port from env
EXPOSE 8080

# Start the real application
CMD ["node", "dist/main"]
