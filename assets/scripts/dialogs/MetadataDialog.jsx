import React from 'react'
import { FormattedMessage } from 'react-intl'
import Dialog from './Dialog'
import LoadingSpinner from '../ui/LoadingSpinner'
import './MetadataDialog.scss'

export default class MetadataDialog extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      name: '',
      matriculationNumber: '',
      projectName: '',
      status: '',
      submissionDate: '',
      directionOfView: '',
      description: '',
      submitting: false,
      submitted: false
    }

    this.nameInputEl = React.createRef()
    this.matriculationNumberInputEl = React.createRef()
    this.projectNamenInputEl = React.createRef()
    this.statusInputEl = React.createRef()
    this.directionOfViewInputEl = React.createRef()
    this.descriptionInputEl = React.createRef()
  }

  componentDidMount = () => {
    this.nameInputEl.current.focus()
  }

  goStoreData = (event) => {
    const receivedData = event.state
    console.log(receivedData)

    this.setState({
      submitting: false,
      submitted: true
    })
  }

  handleChange = (event) => {
    const target = event.target
    const name = target.name
    const value = target.value

    this.setState({
      [name]: value
    })
  }

  handleSubmit = (event) => {
    event.preventDefault()

    // Note: we don't validate the input here;
    // we let HTML5 <input type="email" required /> do validation
    this.setState({
      submitting: true
    })

    this.goStoreData(this)
  }

  renderErrorMessage = () => {
    return (
      <p className="metadata-error-message">
        <FormattedMessage
          id="dialogs.metadata.submit-invalid"
          defaultMessage="Oops! Seems the submission of your work did not work, please try again or contact local support"
        />
      </p>
    )
  }

  renderSubmitWaiting = () => {
    return (
      <Dialog>
        {() => (
          <div className="metadata-dialog">
            <header>
              <h1 className="metadata-loading-message">
                <FormattedMessage
                  id="dialogs.metadata.loading-message"
                  defaultMessage="Submitting your data…"
                />
              </h1>
            </header>
            <div
              className="dialog-content submit-loading"
              aria-live="polite"
              aria-busy="true"
            >
              <LoadingSpinner />
            </div>
          </div>
        )}
      </Dialog>
    )
  }

  renderSubmitted = () => {
    return (
      <Dialog>
        {() => (
          <div className="metadata-dialog">
            <header>
              <h1 className="metadata-loading-message">
                <FormattedMessage
                  id="dialogs.metadata.heading-submitted"
                  defaultMessage="Submitted your work"
                />
              </h1>
            </header>
            <div className="dialog-content sign-in-email-sent">
              <p>
                <FormattedMessage
                  id="dialogs.metadata.submit-message"
                  defaultMessage="We have send you an confirmation of the submission and a link to this project to your email."
                />
              </p>
            </div>
          </div>
        )}
      </Dialog>
    )
  }

  render () {
    const { submitting, submitted } = this.state

    if (submitting) {
      return this.renderSubmitWaiting()
    } else if (submitted) {
      return this.renderSubmitted()
    }

    return (
      <Dialog>
        {(closeDialog) => (
          <div className="metadata-dialog">
            <header>
              <h1>
                <FormattedMessage
                  id="dialogs.metadata.heading"
                  defaultMessage="Adding additional information regarding your project"
                />
              </h1>
            </header>
            <div className="dialog-content">
              <p>
                <FormattedMessage
                  id="dialogs.metadata.description"
                  defaultMessage="Please add the following metadata to your work."
                />
              </p>

              <form onSubmit={this.handleSubmit}>
                <label htmlFor="metadata-name-input" className="metadata-label">
                  <FormattedMessage
                    id="dialogs.metadata.name-label"
                    defaultMessage="Full name"
                  />
                </label>
                <input
                  type="text"
                  id="metadata-name-input"
                  ref={this.nameInputEl}
                  value={this.state.name}
                  className={
                    'metadata-input ' +
                    (this.state.error ? 'metadata-input-error' : '')
                  }
                  name="name"
                  onChange={this.handleChange}
                  placeholder="John Doe"
                  required={true}
                />

                <label
                  htmlFor="metadata-matriculationNumber-input"
                  className="metadata-label"
                >
                  <FormattedMessage
                    id="dialogs.metadata.matriculationNumber-label"
                    defaultMessage="Matriculation number"
                  />
                </label>
                <input
                  type="number"
                  id="metadata-matriculationNumber-input"
                  ref={this.matriculationNumberInputEl}
                  value={this.state.matriculationNumber}
                  className={
                    'metadata-input ' +
                    (this.state.error ? 'metadata-input-error' : '')
                  }
                  name="matriculationNumber"
                  onChange={this.handleChange}
                  placeholder="12345678"
                  required={true}
                />

                <label
                  htmlFor="metadata-projectName-input"
                  className="metadata-label"
                >
                  <FormattedMessage
                    id="dialogs.metadata.projectName-label"
                    defaultMessage="Project name"
                  />
                </label>
                <input
                  type="text"
                  id="metadata-projectName-input"
                  ref={this.projectNameInputEl}
                  value={this.state.projectName}
                  className={
                    'metadata-input ' +
                    (this.state.error ? 'metadata-input-error' : '')
                  }
                  name="projectName"
                  onChange={this.handleChange}
                  placeholder="Project 1"
                  required={true}
                />

                <label
                  htmlFor="metadata-projectStatus-input"
                  className="metadata-label"
                >
                  <FormattedMessage
                    id="dialogs.metadata.projectStatus-label"
                    defaultMessage="Street section status as of"
                  />
                </label>

                <input
                  type="date"
                  id="metadata-projectStatus-input"
                  ref={this.statusInputEl}
                  value={this.state.status}
                  className={
                    'metadata-input ' +
                    (this.state.error ? 'metadata-input-error' : '')
                  }
                  name="status"
                  onChange={this.handleChange}
                  required={true}
                />

                <label
                  htmlFor="metadata-directionOfView-input"
                  className="metadata-label"
                >
                  <FormattedMessage
                    id="dialogs.metadata.directionOfView-label"
                    defaultMessage="Direction of view: looking towards ..."
                  />
                </label>

                <select
                  className="metadata-input"
                  value={this.state.value}
                  onChange={this.handleChange}
                >
                  <option selected={true} value="0">
                    North
                  </option>
                  <option value="45">North-east</option>
                  <option value="90">East</option>
                  <option value="135">East-south</option>
                  <option value="180">South</option>
                  <option value="225">South-west</option>
                  <option value="270 ">West</option>
                  <option value="315">West-north</option>
                </select>

                <label
                  htmlFor="metadata-description-input"
                  className="metadata-label"
                >
                  <FormattedMessage
                    id="dialogs.metadata.description-label"
                    defaultMessage="Description"
                  />
                </label>

                <textarea
                  className="metadata-input"
                  value={this.state.value}
                  onChange={this.handleChange}
                />

                {this.state.error && this.renderErrorMessage()}

                <p className="metadata-note">
                  <small>
                    <FormattedMessage
                      id="dialogs.metadata.note"
                      defaultMessage="We will send you a confirmation of the submission and a link to this project to your email."
                    />
                  </small>
                </p>

                <button
                  type="submit"
                  className="button-primary submit-button submit-email-button"
                >
                  <FormattedMessage
                    id="dialogs.metadata.button"
                    defaultMessage="Submitting your work"
                  />
                </button>
              </form>
            </div>

            <footer>
              <p className="metadata-disclaimer">
                <FormattedMessage
                  id="dialogs.sign-in.tos"
                  defaultMessage="By clicking one of these buttons, I agree to the
                    {tosLink} and {privacyLink}."
                  values={{
                    tosLink: (
                      <a href="/terms-of-service" target="_blank">
                        <FormattedMessage
                          id="dialogs.sign-in.tos-link-label"
                          defaultMessage="terms of service"
                        />
                      </a>
                    ),
                    privacyLink: (
                      <a href="/privacy-policy" target="_blank">
                        <FormattedMessage
                          id="dialogs.sign-in.privacy-link-label"
                          defaultMessage="privacy policy"
                        />
                      </a>
                    )
                  }}
                />
              </p>
            </footer>
          </div>
        )}
      </Dialog>
    )
  }
}
