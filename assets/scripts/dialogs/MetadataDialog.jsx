import React from 'react'
import { FormattedMessage } from 'react-intl'
import Dialog from './Dialog'
import LoadingSpinner from '../ui/LoadingSpinner'
import './MetadataDialog.scss'
import { API_URL } from '../app/config'

import store from '../store'

const axios = require('axios')

export default class MetadataDialog extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      userId: '',
      userEmail: '',
      userExtensionId: '',
      fullName: '',
      matriculationNumber: '',

      streetId: '',
      streetname: '',
      namespacedId: '',
      streetExtensionId: '',
      projectName: '',
      planDreamVision: false,
      sectionStatus: '',
      directionOfView: '',
      allowExternalChange: false,
      description: '',

      submitting: false,
      submitted: false
    }

    this.fullNameInputEl = React.createRef()
    this.matriculationNumberInputEl = React.createRef()
    this.projectNamenInputEl = React.createRef()
    this.planDreamVisionInputEl = React.createRef()
    this.streetSectionSInputEl = React.createRef()
    this.allowExternalChangeInputEl = React.createRef()
    this.directionOfViewInputEl = React.createRef()
    this.descriptionInputEl = React.createRef()

    this.loadExtensionData = this.loadExtensionData.bind(this)
  }

  componentDidMount = () => {
    const userId = Object.keys(store.getState().user.profileCache)[0]
    const streetname = store.getState().street.name
    const streetId = store.getState().street.id
    const namespacedId = store.getState().street.namespacedId
    let userEmail = store.getState().user.signInData.details

    // used for sending the user a confirmation email
    if (userEmail) {
      userEmail = userEmail.email || ''
    }

    this.setState(
      {
        userEmail: userEmail,
        userId: userId,
        streetId: streetId,
        namespacedId: namespacedId,
        streetname: streetname
      },
      this.loadExtensionData
    )

    this.fullNameInputEl.current.focus()
  }

  loadExtensionData = async function () {
    // add extension data if available
    const userExtension = await this.fetch(
      this.state.userId,
      'GET',
      'userExtension'
    )

    if (userExtension) {
      this.setState({
        userExtensionId: userExtension.id,
        fullName: userExtension.fullName,
        matriculationNumber: userExtension.matriculationNumber
      })
    }

    const streetExtension = await this.fetch(
      this.state.streetId,
      'GET',
      'streetExtension'
    )

    if (streetExtension) {
      this.setState({
        streetExtensionId: streetExtension.id,
        projectName: streetExtension.projectName,
        planDreamVision: streetExtension.planDreamVision,
        sectionStatus: streetExtension.sectionStatus ? streetExtension.sectionStatus.split('T')[0] : '',
        directionOfView: streetExtension.directionOfView,
        allowExternalChange: streetExtension.allowExternalChange,
        description: streetExtension.description
      })
    }
  }

  fetch = async function (id, method, endpoint, body) {
    const apiUri = API_URL + 'v1'
    let response

    try {
      if (method === 'POST') {
        if (id === '') {
          response = await axios.post(`${apiUri}/${endpoint}`, body)
        } else response = await axios.put(`${apiUri}/${endpoint}/${id}`, body)
      } else {
        if (id !== '') {
          response = await axios.get(`${apiUri}/${endpoint}/${id}`)
        } else {
          response = await axios.get(`${apiUri}/${endpoint}`)
        }
      }
    } catch (error) {
      console.log(error)
      return ''
    }
    return response.data
  }

  goStoreData = () => {
    const streetExtensionData = {
      streetId: this.state.streetId,
      projectName: this.state.projectName,
      directionOfView: this.state.directionOfView,
      sectionStatus: this.state.sectionStatus,
      planDreamVision: this.state.planDreamVision,
      allowExternalChange: this.state.allowExternalChange,
      description: this.state.description
    }

    if (this.state.streetExtensionId) {
      streetExtensionData.streetExtensionId = this.state.streetExtensionId
      this.fetch(
        this.state.streetExtensionId,
        'POST',
        'streetExtension',
        streetExtensionData
      )
    } else {
      this.fetch('', 'POST', 'streetExtension', streetExtensionData)
    }

    const userExtensionData = {
      userId: this.state.userId,
      fullName: this.state.fullName,
      matriculationNumber: this.state.matriculationNumber
    }

    if (this.state.userExtensionId) {
      userExtensionData.userId = this.state.userId
      this.fetch(
        this.state.userExtensionId,
        'POST',
        'userExtension',
        userExtensionData
      )
    } else {
      this.fetch('', 'POST', 'userExtension', userExtensionData)
    }

    // reload data from server and disable loading view
    this.loadExtensionData()
    this.setState({
      submitting: false,
      submitted: true
    })

    // send submittion email
    const email = {
      secret: 'DasIstEinSicheresPasswort10!',
      from: 'fvv.office@tuwien.ac.at',
      to: this.state.userEmail,
      subject: 'Sucessfull storage of the additional metadata',
      url: this.state.userId + '/' + this.state.namespacedId,
      streetname: this.state.streetname
    }

    this.fetch('', 'POST', 'sendEmail', email)
  }

  handleChange = (event) => {
    const target = event.target
    const name = target.name
    let value = target.value

    // implement switch of checkboxes
    if (target.type === 'checkbox') {
      value = value !== 'true'

      // reset the sectoin status if checkbox checked
      if (name === 'planDreamVision' && value) {
        this.setState({
          sectionStatus: ''
        })
      }
    }

    this.setState({
      [name]: value
    })
  }

  handleSubmit = (event) => {
    event.preventDefault()

    this.setState({
      submitting: true
    })

    this.goStoreData()
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
              className="metadata-dialog-content submit-loading"
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
                  ref={this.fullNameInputEl}
                  value={this.state.fullName}
                  className={
                    'metadata-input ' +
                    (this.state.error ? 'metadata-input-error' : '')
                  }
                  name="fullName"
                  onChange={this.handleChange}
                  placeholder="John Doe"
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
                />

                <label
                  htmlFor="metadata-planDreamVision-input"
                  className="metadata-label"
                >
                  <FormattedMessage
                    id="dialogs.metadata.planDreamVision-label"
                    defaultMessage="Plan / dream vision"
                  />
                </label>

                <input
                  type="checkbox"
                  id="metadata-planDreamVision-input"
                  ref={this.planDreamVisionInputEl}
                  value={this.state.planDreamVision}
                  checked={this.state.planDreamVision}
                  name="planDreamVision"
                  onChange={this.handleChange}
                />

                {!this.state.planDreamVision && (
                  <>
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
                      ref={this.sectionStatusInputEl}
                      value={this.state.sectionStatus}
                      className={
                        'metadata-input ' +
                        (this.state.error ? 'metadata-input-error' : '')
                      }
                      name="sectionStatus"
                      onChange={this.handleChange}
                      required={true}
                    />
                  </>
                )}

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
                  id="metadata-directionOfView-input"
                  className="metadata-input"
                  name="directionOfView"
                  value={this.state.directionOfView}
                  onChange={this.handleChange}
                >
                  <option />
                  <option value="0">North</option>
                  <option value="45">North-east</option>
                  <option value="90">East</option>
                  <option value="135">East-south</option>
                  <option value="180">South</option>
                  <option value="225">South-west</option>
                  <option value="270 ">West</option>
                  <option value="315">West-north</option>
                </select>

                <label
                  htmlFor="metadata-allowExternalChange-input"
                  className="metadata-label"
                >
                  <FormattedMessage
                    id="dialogs.metadata.allowExternalChange-label"
                    defaultMessage="Allow external change"
                  />
                </label>

                <input
                  type="checkbox"
                  id="metadata-allowExternalChange-input"
                  ref={this.allowExternalChangeInputEl}
                  value={this.state.allowExternalChange}
                  checked={this.state.allowExternalChange}
                  name="allowExternalChange"
                  onChange={this.handleChange}
                />

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
                  id="metadata-description-input"
                  ref={this.descriptionInputEl}
                  name="description"
                  className="metadata-input"
                  value={this.state.description}
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
