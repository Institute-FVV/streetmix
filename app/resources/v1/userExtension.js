const config = require('config')
const { v1: uuidv1 } = require('uuid')
const logger = require('../../../lib/logger.js')()
const { ERRORS } = require('../../../lib/util')
const { UserExtension, User } = require('../../db/models')

exports.get = async function (req, res) {
  let userExtensionList

  try {
    userExtensionList = await UserExtension.findAll()
  } catch (err) {
    logger.error(err)
    res.status(500).json({ status: 500, msg: 'Could load extension data.' })
    return
  }

  if (!userExtensionList) {
    res.status(404).json({ status: 404, msg: 'Could load extension data.' })
    return
  }

  res.set('Access-Control-Allow-Origin', '*')
  res.set('Location', config.restapi.baseuri + '/v1/userExtension')
  res.status(200).json(userExtensionList)
}

exports.post = async function (req, res) {
  let body
  const extension = {}
  extension.id = uuidv1()

  if (req.body) {
    try {
      body = req.body
    } catch (e) {
      res
        .status(400)
        .json({ status: 400, msg: 'Could not parse body as JSON.' })
      return
    }

    extension.userId = body.userId
    extension.fullName = body.fullName
    extension.matriculationNumber = body.matriculationNumber
  }

  const saveExtension = async function () {
    return UserExtension.create(extension)
  }

  const handleCreatedExtension = (e) => {
    logger.info({ extension: e }, 'New extension has been added.')
    res.header('Location', config.restapi.baseuri + '/v1/userExtension/' + e.id)
    res.status(201).json(e)
  }

  function handleErrors (error) {
    switch (error) {
      case ERRORS.USER_NOT_FOUND:
        res.status(404).json({ status: 404, msg: 'User not found.' })
        return
      case ERRORS.EXTENSION_NOT_FOUND:
        res.status(404).json({ status: 404, msg: 'Extension not found.' })
        return
      case ERRORS.UNAUTHORISED_ACCESS:
        res
          .status(401)
          .json({ status: 401, msg: 'User with that login token not found.' })
        return
      default:
        res.status(500).end()
    }
  }

  // main
  if (req.user) {
    // user present, check if authenticated
    let user
    try {
      user = await User.findOne({
        where: { auth0_id: req.user.sub }
      })
    } catch (err) {
      logger.error(err)
      handleErrors(ERRORS.USER_NOT_FOUND)
    }

    if (!user) {
      handleErrors(ERRORS.UNAUTHORISED_ACCESS)
    }

    saveExtension().then(handleCreatedExtension)
  } else {
    saveExtension().then(handleCreatedExtension)
  }
}

exports.find = async function (req, res) {
  const userId = req.params.userId

  const findExtensionWithUserId = async function () {
    return UserExtension.findOne({
      where: { user_id: userId }
    })
  }

  function handleErrors (error) {
    switch (error) {
      case ERRORS.USER_NOT_FOUND:
        res.status(404).json({ status: 404, msg: 'User not found.' })
        return
      case ERRORS.EXTENSION_NOT_FOUND:
        res.status(404).json({ status: 404, msg: 'Extension not found.' })
        return
      case ERRORS.UNAUTHORISED_ACCESS:
        res
          .status(401)
          .json({ status: 401, msg: 'User with that login token not found.' })
        return
      default:
        res.status(500).end()
    }
  }

  const handleFindExtension = function (extension) {
    if (!extension) {
      handleErrors(ERRORS.EXTENSION_NOT_FOUND)
    }

    res.set('Access-Control-Allow-Origin', '*')
    res.set('Content-Length', 0)
    res.status(200).json(extension)
  }

  try {
    const extension = await findExtensionWithUserId()

    if (!extension) {
      handleErrors(ERRORS.EXTENSION_NOT_FOUND)
    } else {
      handleFindExtension(extension)
    }
  } catch (err) {
    console.log(err)
    handleErrors(err)
  }
}

exports.put = async function (req, res) {
  let body

  if (req.body) {
    try {
      body = req.body
    } catch (e) {
      res
        .status(400)
        .json({ status: 400, msg: 'Could not parse body as JSON.' })
      return
    }
  } else {
    res
      .status(400)
      .json({ status: 400, msg: 'extension information not specified.' })
    return
  }

  if (!req.params.userExtensionId) {
    res.status(400).json({ status: 400, msg: 'Please provide extension ID.' })
    return
  }

  function handleErrors (error) {
    switch (error) {
      case ERRORS.EXTENSION_NOT_FOUND:
        res.status(404).json({ status: 404, msg: 'Extension not found.' })
        return
      case ERRORS.CANNOT_UPDATE_EXTENSION:
        res
          .status(500)
          .json({ status: 500, msg: 'Could not update extension.' })
        return
      case ERRORS.UNAUTHORISED_ACCESS:
        res.status(401).json({ status: 401, msg: 'User is not signed-in.' })
        return
      case ERRORS.FORBIDDEN_REQUEST:
        res.status(403).json({
          status: 403,
          msg: 'Signed-in user cannot update this user.'
        })
        return
      default:
        logger.error(error)
        res.status(500).end()
    }
  } // END function - handleErrors

  async function updateUserData (extension) {
    extension.userId = body.userId || extension.userId
    extension.fullName = body.fullName || extension.fullName
    extension.matriculationNumber =
      body.matriculationNumber || extension.matriculationNumber

    if (body.userId) {
      let origUser
      try {
        origUser = await User.findOne({
          where: { id: body.userId }
        })
      } catch (err) {
        logger.error(err)
        handleErrors(ERRORS.CANNOT_UPDATE_EXTENSION)
      }

      if (!origUser) {
        throw new Error(ERRORS.CANNOT_UPDATE_EXTENSION)
      }
    }

    return extension.save({ returning: true })
  }

  let extension
  try {
    extension = await UserExtension.findOne({
      where: { id: req.params.userExtensionId }
    })
  } catch (err) {
    logger.error(err)
    handleErrors(ERRORS.CANNOT_UPDATE_EXTENSION)
  }

  if (!extension) {
    handleErrors(ERRORS.EXTENSION_NOT_FOUND)
  } else {
    updateUserData(extension)
      .then((extension) => {
        res.status(204).end()
      })
      .catch(handleErrors)
  }
}
