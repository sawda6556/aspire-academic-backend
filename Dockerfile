FROM node:20
WORKDIR /app
CMD ["node", "-e", "const http = require('http'); const port = process.env.PORT || 3000; http.createServer((req, res) => { res.writeHead(200, {'Content-Type': 'application/json'}); res.end(JSON.stringify(process.env, null, 2)); }).listen(port, '0.0.0.0', () => console.log('Probe listening on ' + port));"]
