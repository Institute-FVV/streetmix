const config = require('config')
const axios = require('axios')
const logger = require('../../lib/logger.js')()
const { Authentication, UserInfo } = require('../../lib/auth0')
const { AuthApiError } = require('auth0')

const getUserInfo = function (user) {
  // Get the platform the user is authenticating from
  // e.g user.sub = facebook|das3fa
  // get 'facebook' out from the user.sub
  const platform = user.sub.split('|')[0]

  if (platform === 'twitter') {
    return getUserTwitterAuth0Info(user)
  }

  return getUserAuth0Info(user)
}

const getUserAuth0Info = function (user) {
  return {
    auth0: {
      nickname: user.nickname,
      auth0Id: user.sub,
      email: user.email,
      profileImageUrl: user.picture
    }
  }
}

const getUserTwitterAuth0Info = function (user) {
  return {
    auth0_twitter: {
      screenName: user[`${config.auth0.screen_name_custom_claim}`],
      auth0Id: user.sub,
      profileImageUrl: user.picture
    }
  }
}

const createOrUpdateUser = async function (req, res, tokens, userProfile) {
  const apiRequestBody = getUserInfo(userProfile)
  const endpoint = `${config.restapi.protocol}${req.headers.host}/api/v1/users`
  const apiRequestOptions = {
    headers: {
      Cookie: `login_token=${tokens.id_token};`
    }
  }

  try {
    const response = await axios.post(endpoint, apiRequestBody, apiRequestOptions)
    const user = response.data
    const userAuthData = apiRequestBody.auth0_twitter
      ? apiRequestBody.auth0_twitter.screenName
      : apiRequestBody.auth0.nickname

    const cookieOptions = { maxAge: 9000000000, sameSite: 'strict' }
    res.cookie('user_id', user.id || userAuthData, cookieOptions)
    if (tokens.refresh_token) {
      res.cookie('refresh_token', tokens.refresh_token, cookieOptions)
    }
    res.cookie('login_token', tokens.id_token, cookieOptions)
    res.redirect('/services/auth/just-signed-in')
  } catch (error) {
    logger.error('Error from auth0 API when signing in: ' + error)
    res.redirect('/error/authentication-api-problem')
  }
}

exports.get = async function (req, res) {
  if (req.query.error) {
    logger.error('Auth0 encountered an error: ' + req.query.error)
    res.redirect('/error/access-denied')
    return
  }

  const code = req.query.code
  const redirectUri = `${config.protocol}${config.app_host_port}${config.auth0.callback_path}`

  if (!code) {
    logger.error('Auth0 did not provide an authorization code.')
    res.redirect('/error/no-access-token')
    return
  }

  try {
    const auth0 = Authentication()
    const tokenResponse = await auth0.oauth.authorizationCodeGrant({
      code,
      redirect_uri: redirectUri
    })
    const tokens = tokenResponse.data

    if (!tokens || !tokens.access_token || !tokens.id_token) {
      logger.error('Auth0 token response missing required fields.')
      res.redirect('/error/no-access-token')
      return
    }

    try {
      const userInfoClient = UserInfo()
      const userInfoResponse = await userInfoClient.getUserInfo(tokens.access_token)
      await createOrUpdateUser(req, res, tokens, userInfoResponse.data)
    } catch (error) {
      logger.error('Error obtaining user info from Auth0: ' + error)
      res.redirect('/error/no-access-token')
    }
  } catch (error) {
    if (error instanceof AuthApiError && error.error === 'access_denied') {
      res.redirect('/error/access-denied')
      return
    }
    logger.error('Error obtaining access token from Auth0: ' + error)
    res.redirect('/error/no-access-token')
  }
}
