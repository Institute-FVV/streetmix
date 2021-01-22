const config = require('config')
const { v1: uuidv1 } = require('uuid')
const logger = require('../../../lib/logger.js')()
const { ERRORS } = require('../../../lib/util')
const { StreetExtension, Street, User } = require('../../db/models')

exports.get = async function (req, res) {
  let streetExtensionList

  try {
    streetExtensionList = await StreetExtension.findAll({
      order: [['updated_at', 'DESC']]
    })
  } catch (err) {
    logger.error(err)
    res.status(500).json({ status: 500, msg: 'Could load extension data.' })
    return
  }

  if (!streetExtensionList) {
    res.status(404).json({ status: 404, msg: 'Could load extension data.' })
    return
  }

  res.set('Access-Control-Allow-Origin', '*')
  res.set('Location', config.restapi.baseuri + '/v1/streetExtension')
  res.status(200).json(streetExtensionList)
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

    extension.streetId = body.streetId
    extension.projectName = body.projectName
    extension.sectionStatus = body.sectionStatus
    extension.directionOfView = body.directionOfView
    extension.allowExternalChange = body.allowExternalChange
    extension.description = body.description
  }

  const saveExtension = async function () {
    return StreetExtension.create(extension)
  }

  const handleCreatedExtension = (e) => {
    logger.info({ extension: e }, 'New extension has been added.')
    res.header(
      'Location',
      config.restapi.baseuri + '/v1/streetExtension/' + e.id
    )
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
    // no user given, not authenticated, no saving
    saveExtension().then(handleCreatedExtension)
  }
}

exports.find = async function (req, res) {
  const streetId = req.params.streetId

  const findExtensionWithStreetId = async function () {
    return StreetExtension.findOne({
      where: { street_id: streetId }
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
  } // END function - handleErrors

  const handleFindExtension = function (extension) {
    if (!extension) {
      handleErrors(ERRORS.EXTENSION_NOT_FOUND)
    }

    res.set('Access-Control-Allow-Origin', '*')
    res.set('Content-Length', 0)
    res.status(200).json(extension)
  } // END function - handleFindStreet

  try {
    const extension = await findExtensionWithStreetId()

    if (!extension) {
      handleErrors(ERRORS.EXTENSION_NOT_FOUND)
    } else {
      handleFindExtension(extension)
    }
  } catch (err) {
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

  if (!req.params.streetExtensionId) {
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
          msg: 'Signed-in user cannot update this street.'
        })
        return
      default:
        res.status(500).end()
    }
  } // END function - handleErrors

  async function updateStreetData (extension) {
    extension.streetId = body.streetId || extension.streetId
    extension.projectName = body.projectName || extension.projectName
    extension.sectionStatus = body.sectionStatus || extension.sectionStatus
    extension.directionOfView =
      body.directionOfView || extension.directionOfView
    extension.allowExternalChange = body.allowExternalChange
    extension.description = body.description || extension.description

    if (body.streetId) {
      let origStreet
      try {
        origStreet = await Street.findOne({
          where: { id: body.streetId }
        })
      } catch (err) {
        logger.error(err)
        handleErrors(ERRORS.CANNOT_UPDATE_EXTENSION)
      }

      if (!origStreet) {
        throw new Error(ERRORS.CANNOT_UPDATE_EXTENSION)
      }
    }

    return extension.save({ returning: true })
  } // END function - updateStreetData

  let extension
  try {
    extension = await StreetExtension.findOne({
      where: { id: req.params.streetExtensionId }
    })
  } catch (err) {
    logger.error(err)
    handleErrors(ERRORS.CANNOT_UPDATE_EXTENSION)
  }

  if (!extension) {
    handleErrors(ERRORS.EXTENSION_NOT_FOUND)
  } else {
    updateStreetData(extension)
      .then((extension) => {
        res.status(204).end()
      })
      .catch(handleErrors)
  }
}
