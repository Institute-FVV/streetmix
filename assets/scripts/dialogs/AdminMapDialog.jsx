import React from 'react'
import Dialog from './Dialog'
import { Map, TileLayer, ZoomControl, Marker } from 'react-leaflet'
import { CircularProgress } from '@material-ui/core'
import { FormattedMessage } from 'react-intl'
import LocationPopup from './Geotag/LocationPopup'
import { API_URL } from '../app/config'

import './AdminMapDialog.scss'

const axios = require('axios')

const MAP_TILES =
  'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png'
const MAP_TILES_2X =
  'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png'
const MAP_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
// zoom level for a closer, 'street' zoom level
const MAP_LOCATION_ZOOM = 12
const DEFAULT_MAP_ZOOM = 2
const DEFAULT_MAP_LOCATION = {
  lat: 10.45,
  lng: -10.78
}

export default class AdminMapDialog extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      mapCenter: DEFAULT_MAP_LOCATION,
      zoom: DEFAULT_MAP_ZOOM,
      markerLocations: [],
      labels: [],
      urls: [],

      selectedMarker: null,
      renderPopup: false,
      isLoading: false
    }
  }

  componentDidMount = () => {
    const that = this

    this.loadData()
      .then(function (response) {
        if (response.mapCenter) {
          that.setState({
            mapCenter: response.mapCenter,
            zoom: response.zoom,
            markerLocations: response.markerLocations,
            labels: response.labels,
            urls: response.urls
          })
        }
      })
  }

  loadData = async function () {
    // Determine initial map center, and what to display
    let mapCenter, zoom
    let labels = []
    let markerLocations = []
    let urls = []

    return this.fetch('', 'get', 'streetExtension')
      .then(response => {
        const streets = response.filter(element =>
          element.Street.data.street.location !== null &&
          element.Street.data.street.location.latlng !== null &&
          element.Street.creator_id)

        if (streets.length > 0) {
          mapCenter = streets[0].Street.data.street.location.latlng
          zoom = MAP_LOCATION_ZOOM

          streets.forEach(street => {
            markerLocations.push(street.Street.data.street.location.latlng)
            labels.push(street.Street.data.street.location.label)
            urls.push(window.location.origin + '/' + street.Street.creatorId + '/' + street.Street.namespacedId)
          })

          return {
            mapCenter,
            zoom,
            markerLocations,
            labels,
            urls
          }
        } else {
          return {}
        }
      })
      .catch(error => {
        console.error(error)
      })
  }

  fetch = async function (id, method, endpoint, body) {
    const apiUri = API_URL + 'v1'
    let response

    this.setState({ isLoading: true })

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

      this.setState({ isLoading: true })
    } catch (error) {
      console.log(error)
      this.setState({ isLoading: true })
      return ''
    }

    return response.data
  }

  onMarkerClick = (event) => {
    this.setState({
      selectedMarker: event.target.options.id,
      renderPopup: true
    })
  }

  onMapClick = (event) => {
    this.setState({
      renderPopup: false
    })
  }

  render () {
    const dpi = 1.0
    const tileUrl = dpi > 1 ? MAP_TILES_2X : MAP_TILES

    return (
      <Dialog>
        {(closeDialog) => (
          <div className="adminmap-dialog">
            {this.state.zoom && (
              <Map
                center={this.state.mapCenter}
                zoomControl={false}
                zoom={this.state.zoom}
                onclick={this.onMapClick}
                useFlyTo={true}
              >
                <TileLayer attribution={MAP_ATTRIBUTION} url={tileUrl} />
                <ZoomControl
                  zoomInTitle="Zoom out"
                  zoomOutTitle="Zoom in"
                />

                {this.state.renderPopup && this.state.selectedMarker && (
                  <LocationPopup
                    position={this.state.markerLocations[this.state.selectedMarker]}
                    label={this.state.labels[this.state.selectedMarker]}
                    url={this.state.urls[this.state.selectedMarker]}
                    handleClear={(e) => {
                      closeDialog()
                    }}
                  />
                )}

                {this.state.markerLocations.length > 0 && this.state.markerLocations.map((markerLocation, key) => (
                  <Marker
                    id={key}
                    key={key}
                    onclick={this.onMarkerClick}
                    position={markerLocation}
                  />
                ))}
              </Map>
            )}

            {this.state.isLoading && (
              <div>
                <FormattedMessage
                  id="dialogs.adminMap.loading"
                  defaultMessage="Data loading"
                />
                <br />
                <CircularProgress size={100} />
              </div>
            )}
          </div>
        )}
      </Dialog>
    )
  }
}
