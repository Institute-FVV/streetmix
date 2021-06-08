import React, { forwardRef } from 'react'
import { FormattedMessage } from 'react-intl'
import Dialog from './Dialog'
import './AdminDialog.scss'
import { API_URL } from '../app/config'
import { CircularProgress } from '@material-ui/core'

// icons for material table
import AddBox from '@material-ui/icons/AddBox'
import ArrowDownward from '@material-ui/icons/ArrowDownward'
import Check from '@material-ui/icons/Check'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ChevronRight from '@material-ui/icons/ChevronRight'
import Clear from '@material-ui/icons/Clear'
import DeleteOutline from '@material-ui/icons/DeleteOutline'
import Edit from '@material-ui/icons/Edit'
import FilterList from '@material-ui/icons/FilterList'
import FirstPage from '@material-ui/icons/FirstPage'
import LastPage from '@material-ui/icons/LastPage'
import Remove from '@material-ui/icons/Remove'
import SaveAlt from '@material-ui/icons/SaveAlt'
import Search from '@material-ui/icons/Search'
import ViewColumn from '@material-ui/icons/ViewColumn'
import MaterialTable from 'material-table'

const axios = require('axios')

// definition used for material table
const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
}

export default class AdminDialog extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      data: [],
      isLoading: false
    }

    this.loadData = this.loadData.bind(this)
  }

  componentDidMount = () => {
    const that = this

    this.setState({ isLoading: true })
    this.loadData().then(function (response) {
      that.setState({
        data: response,
        isLoading: false
      })
    })
  }

  loadData = async function () {
    const data = []
    const streetExtensions = await this.fetch('streetExtension', '')

    for (const streetExtension of streetExtensions) {
      const result = {}

      // street extension data
      result.streetId = streetExtension.streetId || ''
      result.streetProjectName = streetExtension.projectName || ''
      result.streetSectionStatus = streetExtension.sectionStatus || ''
      result.streetSectionStatus = streetExtension.sectionStatus.split('T')[0]
      result.streetDirectionOfView = streetExtension.directionOfView || ''
      result.streetDirectionOfView = result.streetDirectionOfView + '°'
      result.allowExternalChange = streetExtension.allowExternalChange
      result.streetDescription = streetExtension.description || ''

      // street data
      result.streetName = streetExtension.Street.name || ''
      result.streetChangedAt = streetExtension.Street.clientUpdatedAt || ''
      result.streetCreator = streetExtension.Street.creator_id || ''
      result.streetDataWidth = streetExtension.Street.data.street.width || ''
      result.url = window.location.origin + '/' + streetExtension.Street.creator_id + '/' + streetExtension.Street.namespaced_id

      // add empty object because some streets do not have to have these information, but materialtable requires it
      if (!streetExtension.Street.data.street.location) {
        streetExtension.Street.data.street.location = {}
        streetExtension.Street.data.street.location.latlng = {}
        streetExtension.Street.data.street.location.hierarchy = {}
      }

      result.streetDataLocationLat =
        streetExtension.Street.data.street.location.latlng.lat || ''
      result.streetDataLocationLng =
        streetExtension.Street.data.street.location.latlng.lng || ''
      result.streetDataLocationLabel =
        streetExtension.Street.data.street.location.label || ''
      result.streetDataLocationCountry =
        streetExtension.Street.data.street.location.hierarchy.country || ''
      result.streetDataLocationRegion =
        streetExtension.Street.data.street.location.hierarchy.region || ''
      result.streetDataLocationLocality =
        streetExtension.Street.data.street.location.hierarchy.locality || ''
      result.streetDataLocationNeighbourhood =
        streetExtension.Street.data.street.location.hierarchy.neighbourhood || ''
      result.streetDataLocationStreet =
        streetExtension.Street.data.street.location.hierarchy.street || ''

      // user extension data
      const userExtension = await this.fetch(
        'userExtension',
        result.streetCreator
      )

      if (userExtension && userExtension.fullName) {
        result.userFullName = userExtension.fullName
        result.userMatriculationNumber = userExtension.matriculationNumber

        if (userExtension.User.roles) {
          result.userRoles = userExtension.User.roles.join(', ')
        } else {
          result.userRoles = 'USER'
        }
      }

      // add result to final array
      data.push(result)
    }

    return data
  }

  fetch = async function (endPoint, id) {
    const apiUri = API_URL + 'v1/' + endPoint + '/' + id
    let response

    try {
      response = await axios.get(apiUri)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }

  render () {
    return (
      <Dialog>
        {(closeDialog) => (
          <div className="admin-dialog admin-dialog-content">
            <header>
              <h1>
                <FormattedMessage
                  id="dialogs.admin.heading"
                  defaultMessage="Saved streets with metadata within Streetmix"
                />
              </h1>
            </header>
            <div className="dialog-content">
              {this.state.data.length > 0 ? (
                // data available, present table
                <MaterialTable
                  icons={tableIcons}
                  columns={[
                    { title: 'Street id', field: 'streetId' },
                    {
                      title: 'Street project name',
                      field: 'streetProjectName'
                    },
                    {
                      title: 'Street section status',
                      field: 'streetSectionStatus'
                    },
                    {
                      title: 'Street direction of view',
                      field: 'streetDirectionOfView'
                    },
                    {
                      title: 'Allow external change',
                      field: 'allowExternalChange'
                    },
                    { title: 'Street description', field: 'streetDescription' },
                    { title: 'Street creator', field: 'streetCreator' },

                    { title: 'Street name', field: 'streetName' },
                    { title: 'Street changed at', field: 'streetChangedAt' },
                    { title: 'Street width', field: 'streetDataWidth' },
                    {
                      title: 'Street location lat',
                      field: 'streetDataLocationLat'
                    },
                    {
                      title: 'Street location lng',
                      field: 'streetDataLocationLng'
                    },
                    {
                      title: 'Street location label',
                      field: 'streetDataLocationLabel'
                    },
                    {
                      title: 'Street location region',
                      field: 'streetDataLocationRegion'
                    },
                    {
                      title: 'Street location locality',
                      field: 'streetDataLocationLocality'
                    },
                    {
                      title: 'Street location neighbourhood',
                      field: 'streetDataLocationNeighbourhood'
                    },
                    {
                      title: 'Street location street',
                      field: 'streetDataLocationStreet'
                    },

                    { title: 'User full name', field: 'userFullName' },
                    { title: 'User roles', field: 'userRoles' },
                    {
                      title: 'User matriculation number',
                      field: 'userMatriculationNumber'
                    },
                    {
                      title: 'Street url',
                      field: 'url',
                      // eslint-disable-next-line react/jsx-no-target-blank
                      render: rowData => <a target="_blank" href={rowData.url}> {rowData.url} </a>
                    }
                  ]}
                  data={this.state.data}
                  options={{
                    showTitle: false,
                    exportButton: true,
                    exportAllData: true,
                    filtering: true,
                    search: false,
                    pageSize: 5
                  }}
                />
              ) : !this.state.isLoading ? (
                <div>
                  <FormattedMessage
                    id="dialogs.admin.noDataAvailable"
                    defaultMessage="Sadly there are currently no data available, please wait a while."
                  />
                </div>
              ) : (
                <div>
                  <FormattedMessage
                    id="dialogs.admin.loading"
                    defaultMessage="Data loading"
                  />
                  <br />
                  <CircularProgress size={100} />
                </div>
              )}
            </div>
          </div>
        )}
      </Dialog>
    )
  }
}
