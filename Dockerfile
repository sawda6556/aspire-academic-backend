FROM node:20-slim
WORKDIR /app
COPY package.json ./
RUN echo "Skipping install"
COPY . .
EXPOSE 3000
CMD ["node", "-e", "const http = require('http'); const port = process.env.PORT || 3000; http.createServer((req, res) => { res.writeHead(200, {'Content-Type': 'application/json'}); res.end(JSON.stringify({message: 'Railway Troubleshoot Docker Server', port, env: Object.keys(process.env).filter(k => !k.includes('SECRET') && !k.includes('PASS') && !k.includes('KEY') && !k.includes('TOKEN'))})); }).listen(port, '0.0.0.0', () => console.log('Listening on ' + port));"]
