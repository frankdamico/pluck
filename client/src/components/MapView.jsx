import React, { Component } from 'react';
import MapGL, { Marker, Popup, NavigationControl } from 'react-map-gl';
import config from '../../../config';

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
      viewport: {
        latitude: 37.785164,
        longitude: -100,
        zoom: 2.8,
        bearing: 0,
        pitch: 0,
        width: 500,
        height: 500,
      },
      popupInfo: null,
    };
    this.renderPopup = this.renderPopup.bind(this);
    this.updateViewport = this.updateViewport.bind(this);
  }

  updateViewport(viewport) {
    this.setState({ viewport });
  }

  renderPopup() {
    const { popupInfo } = this.state;
    return popupInfo && (
      <Popup
        tipSize={5}
        anchor="bottom-right"
        longitude={popupInfo.state.longitude}
        latitude={popupInfo.state.latitude}
        onClose={() => this.setState({ popupInfo: null })}
        closeOnClick
      >
        <p>TEST</p>
      </Popup>
    );
  }

  render() {
    const { popupInfo, viewport } = this.state;
    return (
      <MapGL
        {...viewport}
        mapStyle="mapbox://styles/mapbox/dark-v9"
        mapboxApiAccessToken={TOKEN}
        onViewportChange={this.updateViewport}
      >
        {this.renderPopup()}
        <div className="nav" style={navStyle}>
          <NavigationControl />
        </div>
      </MapGL>
    );
  }
}
