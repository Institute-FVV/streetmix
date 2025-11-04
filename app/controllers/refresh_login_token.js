const logger = require('../../lib/logger.js')()
const { Authentication } = require('../../lib/auth0')

// Refreshes auth0 token so user doesn't need to sign in every 30 days
exports.post = async function (req, res) {
  if (!req.body || !req.body.token) {
    res.status(401).json({ status: 401, msg: 'Refresh token is required.' })
    return
  }

  const auth0 = Authentication()

  try {
    const tokenResponse = await auth0.oauth.refreshTokenGrant({
      refresh_token: req.body.token
    })

    if (!tokenResponse.data.id_token) {
      logger.error('Missing results from token refresh: ')
      res.status(401).json({ status: 401, msg: 'Unable to refresh token.' })
      return
    }

    const cookieOptions = { maxAge: 9000000000, sameSite: 'strict' }
    res.cookie('login_token', tokenResponse.data.id_token, cookieOptions)
    res.status(200).json({ token: tokenResponse.data.id_token })
  } catch (error) {
    logger.error('Error from auth0 refreshing tokens: ' + error)
    res.status(401).json({ status: 401, msg: 'Unable to refresh token.' })
  }
}
