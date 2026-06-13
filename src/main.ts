
console.log('PROBE: Starting ULTRA MINIMAL process');
const http = require('http');
const port = process.env.PORT || 3000;
console.log('PROBE: Port is ' + port);

const server = http.createServer((req, res) => {
  console.log('PROBE: Received request ' + req.url);
  res.writeHead(200, {'Content-Type': 'application/json'});
  
  const env = {};
  Object.keys(process.env).forEach(k => {
    if (!k.includes('SECRET') && !k.includes('PASS') && !k.includes('KEY') && !k.includes('TOKEN')) {
      env[k] = process.env[k];
    } else {
      env[k] = '********';
    }
  });

  res.end(JSON.stringify({ 
    status: 'ok', 
    message: 'ULTRA MINIMAL DEBUG SERVER', 
    timestamp: new Date().toISOString(),
    env 
  }, null, 2));
});

server.listen(port, '0.0.0.0', () => {
  console.log('PROBE: Debug server listening on ' + port);
});

// Keep process alive indefinitely
setInterval(() => {
  console.log('PROBE: Still alive... ' + new Date().toISOString());
}, 10000);
