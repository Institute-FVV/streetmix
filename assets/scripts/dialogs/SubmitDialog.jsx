import React from 'react'
import { FormattedMessage } from 'react-intl'
import Dialog from './Dialog'
import LoadingSpinner from '../ui/LoadingSpinner'
import './SubmitDialog.scss'

export default class SubmitDialog extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      name: '',
      matrikelNummer: '',
      email: '',
      submitting: false,
      submitted: false
    }

    this.nameInputEl = React.createRef()
    this.martikelNummerInputEl = React.createRef()
    this.emailInputEl = React.createRef()
  }

  componentDidMount = () => {
    this.emailInputEl.current.focus()
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
      <p className="submit-error-message">
        <FormattedMessage
          id="dialogs.submit.submit-invalid"
          defaultMessage="Oops! Seems the submission of your work did not work, please try again or contact local support"
        />
      </p>
    )
  }

  renderSubmitWaiting = () => {
    return (
      <Dialog>
        {() => (
          <div className="submit-dialog">
            <header>
              <h1 className="submit-loading-message">
                <FormattedMessage
                  id="dialogs.submit.loading-message"
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
          <div className="submit-dialog">
            <header>
              <h1 className="submit-loading-message">
                <FormattedMessage
                  id="dialogs.submit.heading-submitted"
                  defaultMessage="Submitted your work"
                />
              </h1>
            </header>
            <div className="dialog-content sign-in-email-sent">
              <p>
                <FormattedMessage
                  id="dialogs.submit.submit-message"
                  defaultMessage="We have send you an {email} confirmation of the submission and a link to this project to your email."
                  values={{
                    email: (
                      <span className="sign-in-email">{this.state.email}</span>
                    )
                  }}
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
    console.log(this.state)
    if (submitting) {
      return this.renderSubmitWaiting()
    } else if (submitted) {
      return this.renderSubmitted()
    }

    return (
      <Dialog>
        {(closeDialog) => (
          <div className="submit-dialog">
            <header>
              <h1>
                <FormattedMessage
                  id="dialogs.submit.heading"
                  defaultMessage="Submit your work"
                />
              </h1>
            </header>
            <div className="dialog-content">
              <p>
                <FormattedMessage
                  id="dialogs.submit.description"
                  defaultMessage="Hand in your design."
                />
              </p>

              <form onSubmit={this.handleSubmit}>
                <label htmlFor="submit-name-input" className="submit-label">
                  <FormattedMessage
                    id="dialogs.submit.name-label"
                    defaultMessage="Full name"
                  />
                </label>
                <input
                  type="text"
                  id="submit-name-input"
                  ref={this.nameInputEl}
                  value={this.state.name}
                  className={
                    'submit-input ' +
                    (this.state.error ? 'submit-input-error' : '')
                  }
                  name="name"
                  onChange={this.handleChange}
                  placeholder="John Doe"
                  required={true}
                />

                <label
                  htmlFor="submit-matrikelNummer-input"
                  className="submit-label"
                >
                  <FormattedMessage
                    id="dialogs.submit.matrikelNummer-label"
                    defaultMessage="MatrikelNummer"
                  />
                </label>
                <input
                  type="number"
                  id="submit-matrikelNummer-input"
                  ref={this.matrikelNummerInputEl}
                  value={this.state.matrikelNummer}
                  className={
                    'submit-input ' +
                    (this.state.error ? 'submit-input-error' : '')
                  }
                  name="matrikelNummer"
                  onChange={this.handleChange}
                  placeholder="12345678"
                  required={true}
                />

                <label
                  htmlFor="submit-email-input"
                  className="submit-email-label"
                >
                  <FormattedMessage
                    id="dialogs.submit.email-label"
                    defaultMessage="Email"
                  />
                </label>
                <input
                  type="email"
                  id="submit-email-input"
                  ref={this.emailInputEl}
                  value={this.state.email}
                  className={
                    'submit-input ' +
                    (this.state.error ? 'submit-input-error' : '')
                  }
                  name="email"
                  onChange={this.handleChange}
                  placeholder="studentname@tuwien.ac.at"
                  required={true}
                />

                {this.state.error && this.renderErrorMessage()}

                <p className="submit-note">
                  <small>
                    <FormattedMessage
                      id="dialogs.submit.note"
                      defaultMessage="We will send you a confirmation of the submission and a link to this project to your email."
                    />
                  </small>
                </p>

                <button
                  type="submit"
                  className="button-primary submit-button submit-email-button"
                >
                  <FormattedMessage
                    id="dialogs.submit.button"
                    defaultMessage="Submitting your work"
                  />
                </button>
              </form>
            </div>

            <footer>
              <p className="submit-disclaimer">
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
