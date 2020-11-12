import React from 'react'
import { FormattedMessage } from 'react-intl'
import Dialog from './Dialog'
import './MetaDataMissing.scss'

const DEFAULT_BODY =
  'So far no meta data has been provided, please do not forget to fill out the metadata for your project using the metadata button on the top right side. You can update the provided data at any time. '

const MetaDataMissing = () => {
  return (
    <Dialog>
      {(closeDialog) => (
        <div className="metadatamissing-dialog">
          <header>
            <h1>
              <FormattedMessage
                id="upgrade.title"
                defaultMessage="Metadata missing for your project"
              />
            </h1>
          </header>
          <div className="metadatamissing-content">{DEFAULT_BODY}</div>
        </div>
      )}
    </Dialog>
  )
}

export default MetaDataMissing
