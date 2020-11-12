const app = require('./app')
const config = require('config')
const logger = require('./lib/logger.js')()

const http = require('http')

// Starting  http
const httpServer = http.createServer(app)

httpServer.listen(config.port, () => {
  logger.info('HTTP Server running on port ' + config.port)
})
