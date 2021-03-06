const winston = require('winston')

const getCircularReplacer = () => {
  const seen = new WeakSet()
  return (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return
      }
      seen.add(value)
    }
    return value
  }
}

// Custom formatter stringifies JavaScript object messages because
// winston@3.0.0 doesn't do this automatically with simple formatting anymore
const formatter = winston.format((info, opts) => {
  if (typeof info.message === 'object') {
    info.message = JSON.stringify(info.message, getCircularReplacer())
  }

  return info
})

const format = winston.format.combine(
  formatter(),
  winston.format.colorize(),
  winston.format.simple()
)

module.exports = function () {
  const logger = winston.createLogger({
    transports: []
  })

  switch (process.env.NODE_ENV) {
    case 'production':
      logger.add(
        new winston.transports.Console({
          format: format,
          level: 'info'
        })
      )
      break
    // Everywhere else -- dev / test environments, usually
    default:
      logger.add(
        new winston.transports.Console({
          format: format,
          level: 'debug'
        })
      )
      break
  }

  return logger
}
