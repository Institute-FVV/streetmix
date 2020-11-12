const logger = require('../../../lib/logger.js')()
const nodemailer = require('nodemailer')
const config = require('config')

exports.post = async function (req, res) {
  const secret = config.email_api_secret
  const transport = nodemailer.createTransport({
    host: config.smtp_relay,
    port: 25
  })
  let body
  const message = {}

  if (req.body) {
    // body present
    try {
      body = req.body
    } catch (e) {
      res
        .status(400)
        .json({ status: 400, msg: 'Could not parse body as JSON.' })
      return
    }

    if (body.secret === secret) {
      // correct secret provided
      message.from = body.from
      message.to = body.to
      message.subject = body.subject
      message.html = body.message

      transport.sendMail(message, function (err, info) {
        if (err) {
          logger.error(err)
          res.status(500).json({ status: 500, msg: 'Could not send email.' })
        } else {
          res.set('Access-Control-Allow-Origin', '*')
          res.status(200).json('confirmation email has been send')
        }
      })
    } else {
      // no secret provided
      res
        .status(401)
        .json({ status: 400, msg: 'Not authorized to use this service.' })
    }
  } else {
    // body not present
    res.status(400).json({ status: 400, msg: 'No body found.' })
  }
}
