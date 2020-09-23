const config = require('config')
const { asStreetJson } = require('../../../lib/util')
const logger = require('../../../lib/logger.js')()
const { CreatorMetadata } = require('../../db/models')

exports.get = async function (req, res) {
  let creatorMetadataList

  try {
    creatorMetadataList = await CreatorMetadata.findAll()
  } catch (err) {
    logger.error(err)
    res.status(500).json({ status: 500, msg: 'Could load creator metadata.' })
    return
  }

  if (!creatorMetadataList) {
    res.status(404).json({ status: 404, msg: 'Could load creator metadata.' })
    return
  }

  // to do replace with asCreatorMetadata
  const result = asStreetJson(creatorMetadataList)
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Location', config.restapi.baseuri + '/v1/creatorMetadata')
  res.status(200).json(result)
}
