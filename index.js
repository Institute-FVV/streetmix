const app = require('./app')
const config = require('config')
const logger = require('./lib/logger.js')()

// const fs = require('fs');
const http = require('http')
// const https = require('https');

// Certificate
// const privateKey = fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/privkey.pem', 'utf8');
// const certificate = fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/cert.pem', 'utf8');
// const ca = fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/chain.pem', 'utf8');
// const credentials = {
// key: privateKey,
// cert: certificate,
// ca: ca
// };

// Starting both http & https servers
const httpServer = http.createServer(app)
// const httpsServer = https.createServer(credentials, app);

if (process.env.NODE_ENV === 'development') {
  httpServer.listen(config.port, () => {
    logger.info('HTTP Server running on port 80')
  })
} else {
  //  httpsServer.listen(443, () => {
  // logger.info('HTTPS Server running on port 443');
  // })
  httpServer.listen(config.port, () => {
    logger.info('HTTP Server running on port 80')
  })
}
