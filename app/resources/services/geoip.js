const axios = require('axios')
const config = require('config')
const chalk = require('chalk')
const logger = require('../../../lib/logger.js')()
const util = require('../../../lib/util.js')

const IP_GEOLOCATION_TIMEOUT = 1000

exports.get = function (req, res) {
  // If API key environment variable has not been provided, return an error.
  if (!config.geoip.api_key) {
    logger.warn(
      chalk.yellow(
        'A request to ' +
          chalk.gray('/services/geoip') +
          ' cannot be fulfilled because the ' +
          chalk.gray('IPSTACK_API_KEY') +
          ' environment variable is not set.'
      )
    )
    res.status(500).json({
      status: 500,
      msg: 'The server does not have access to the IP geolocation provider.'
    })
    return
  }

  const requestGeolocation = function (isRedisConnected = true) {
    if (ip.includes('127.0.0.1') || ip.includes('172.19.0.1')) {
      ip = '128.131.201.160'
    }

    let url = `${config.geoip.protocol}${config.geoip.host}`
    url += req.hostname === 'localhost' ? 'check' : ip
    url += `?access_key=${config.geoip.api_key}`

    axios
      .get(url, { timeout: IP_GEOLOCATION_TIMEOUT })
      .then((response) => {
        const body = response.data

        // because of malformatted json we need to stringify it first
        const data = JSON.parse(JSON.stringify(body))

        // If ipstack returns an error, catch it and return a generic error.
        // Log the error so we can examine it later.
        // Do not use a falsy check here. A succesful response from ipstack does
        // not contain the `success` property. It is only present when it fails.
        if (data.success === false) {
          res.status(500).json({
            status: 500,
            msg: 'The IP geolocation provider returned an error.'
          })
          return
        }

        res.status(200).json(data)
      })
      .catch(function (error) {
        console.log(error)
        // enriched error handling
        if (error.response) {
          // Request made and server responded
          logger.error(error.response.data)
          logger.error(error.response.status)
          logger.error(error.response.headers)
        } else if (error.request) {
          // The request was made but no response was received
          logger.error(error.request)
        } else {
          // Something happened in setting up the request that triggered an Error
          logger.error(error.message)
        }

        res.status(500).json(error)
      })
  }

  var ip = util.requestIp(req)
  requestGeolocation()
}
