import React from 'react';
import { Marker } from 'react-map-gl';
import PlantPin from './plant-pin.jsx';
  
const PlantMarker = (plant, index) => (
  <Marker
    key={`marker-${index}`}
    longitude={plant.longitude}
    latitude={plant.latitude}
  >
    <PlantPin size={20} onClick={() => this.setState({ popupInfo: plant })} />
  </Marker>
);
