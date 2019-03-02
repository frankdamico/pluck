import React from 'react';
import { Popup } from 'react-map-gl';
import PlantInfo from './plant-info.jsx';


const PopupContainer = props => (
  <Popup
    tipSize={5}
    anchor="bottom-right"
    longitude={popupInfo.state.longitude}
    latitude={popupInfo.state.latitude}
    closeOnClick
    onClose={() => this.setState({ popupInfo: null })}
  >
    <PlantInfo info={popupInfo} />
    <p>TEST</p>
  </Popup>
);
