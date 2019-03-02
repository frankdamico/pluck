import React, { Component } from 'react';
import { render } from 'react-dom';
import MapGL, { Marker, Popup, NavigationControl } from 'react-map-gl';
import config from '../../../config';
// import PlantPin from './plant-pin.jsx';
// import PlantInfo from './plant-info.jsx';
// import { GeolocateControl } from 'react-map-gl';

import CityPin from './city-pin.jsx';
import CityInfo from './city-info.jsx';

import CITIES from './cities.js';

const TOKEN = config.pubKey; // Set your mapbox token here
const navStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  padding: '10px',
};
export default class MapView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: props.viewport,
      popupInfo: null,
    };
    this.updateViewport = this.updateViewport.bind(this);
    this.renderCityMarker = this.renderCityMarker.bind(this);
    this.renderPopup = this.renderPopup.bind(this);

  }

  componentWillReceiveProps({ viewport: newViewPort }) {
    this.setState({
      viewport: newViewPort,
    });
  }

  updateViewport(viewport) {
    const { viewport: { latitude, longitude }} = this.props;
    this.setState({ 
      viewport: {
        latitude,
        longitude,
        ...viewport,
      } });
  }

  renderCityMarker(city, index) {
    return (
      <Marker
        key={`marker-${index}`}
        longitude={city.longitude}
        latitude={city.latitude}
      >
        <CityPin size={20} onClick={() => this.setState({ popupInfo: city })} />
      </Marker>
    );
  }

  renderPopup() {
    const { popupInfo } = this.state;

    return popupInfo && (
      <Popup tipSize={5}
        anchor="top"
        longitude={popupInfo.longitude}
        latitude={popupInfo.latitude}
        closeOnClick={false}
        onClose={() => this.setState({ popupInfo: null })} 
      >
        <CityInfo info={popupInfo} />
      </Popup>
    );
  }


  render() {
    // debugger;
    const { popupInfo, viewport } = this.state;
    const { allPlants } = this.props;
    return (
      <MapGL
        {...viewport}
        mapStyle="mapbox://styles/mapbox/basic-v9"
        mapboxApiAccessToken={TOKEN}
        onViewportChange={this.updateViewport}
      >
        {/* <GeolocateControl
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={true}
          onViewportChange={this._updateViewport}
        /> */}
        {/* {CITIES.map(this.renderPlantMarker)} */}
        {/* {CITIES.map(this.renderCityMarker)} */}
        {allPlants.map(this.renderCityMarker)}

        {this.renderPopup()}

        <div className="nav" style={navStyle}>
          <NavigationControl onViewportChange={this.updateViewport} />
        </div>
      </MapGL>
    );
  }
}
