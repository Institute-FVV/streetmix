import React from 'react'
import PropTypes from 'prop-types'
import { ENV } from '../app/config'
import './EnvironmentBadge.scss'

EnvironmentBadge.propTypes = {
  label: PropTypes.string,
  env: PropTypes.string
}

function EnvironmentBadge (props) {
  const classNames = ['environment-badge']
  const { label, className } = getDetails(props)

  if (className) {
    classNames.push(className)
  }

  // Displays a label. Nothing happens if there isn't one.
  if (label) {
    return <div className={classNames.join(' ')}>{label}</div>
  } else {
    return null
  }
}

function getDetails (props) {
  // If a label is not provided, determine one using ENV
  if (!props.label) {
    switch (ENV) {
      case 'development':
        return {
          label: '@FVV-TU-Vienna-DEV',
          className: 'environment-label-tu-wien'
        }
      case 'staging':
        return {
          label: 'Staging',
          className: 'environment-label-staging'
        }
      case 'sandbox':
        return {
          label: 'Sandbox',
          className: 'environment-label-sandbox'
        }
      case 'demo':
        return {
          label: 'Demo',
          className: 'environment-label-demo'
        }
      default:
        return {
          label: '@FVV-TU-Vienna',
          className: 'environment-label-tu-wien'
        }
    }
  }

  return {
    label: props.label
  }
}

export default React.memo(EnvironmentBadge)
