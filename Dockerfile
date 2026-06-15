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

# Runner stage
FROM node:20 AS runner

WORKDIR /app

# Copy EVERYTHING from builder
COPY --from=builder /app ./

# Set environment variables
ENV NODE_ENV=production
ENV ALLOW_DEGRADED_MODE=true

# START A DUMMY SERVER FOR INFRASTRUCTURE VERIFICATION
CMD ["node", "-e", "const http = require('http'); const port = process.env.PORT || 3000; http.createServer((req, res) => { console.log('Req:', req.url); res.writeHead(200, {'Content-Type': 'application/json'}); res.end(JSON.stringify({ status: 'INFRA_OK', env: { PORT: process.env.PORT, NODE_VERSION: process.version } })); }).listen(port, '0.0.0.0', () => { console.log('Dummy server listening on port', port); });"]
