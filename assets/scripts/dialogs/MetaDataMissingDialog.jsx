import React from 'react'
import { FormattedMessage } from 'react-intl'
import Dialog from './Dialog'
import './MetaDataMissingDialog.scss'

const DEFAULT_BODY =
  'So far no meta data has been provided, please do not forget to fill out the metadata for your project using the metadata button on the top right side. You can update the provided data at any time.'

const MetaDataMissingDialog = () => {
  return (
    <Dialog>
      {(closeDialog) => (
        <div className="metadatamissing-dialog">
          <header>
            <h1>
              <FormattedMessage
                id="metadata-missing.title"
                defaultMessage="Metadata missing for your project"
              />
            </h1>
          </header>
          <div className="metadatamissing-content">
            <FormattedMessage
              id="metadata-missing.description"
              defaultMessage={DEFAULT_BODY}
            />
          </div>
        </div>
      )}
    </Dialog>
  )
}

export default MetaDataMissingDialog
