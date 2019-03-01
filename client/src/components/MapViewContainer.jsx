import React from 'react';
import axios from 'axios';
import MapView from './MapView.jsx';

class MapViewContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.getAddress = this.getAddress.bind(this);
    this.setUserLocation = this.setUserLocation.bind(this);
  }

  componentDidMount() {
    if (navigator.geolocation) {
      console.log('Geolocation is supported!');
      const geoOptions = {
        timeout: 10 * 1000,
      };
      const geoSuccess = (position) => {
        const currentLoc = [position.coords.latitude, position.coords.longitude];
        this.setUserLocation(currentLoc);
      };
      const geoError = (error) => {
        console.log('Error occurred. Error code: ', error.code);
      };

      navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
    } else {
      console.log('Geolocation is not supported for this Browser/OS.');
    }
  }

  setUserLocation(location) {
    this.setState({
      userLoc: location,
    });
  }


  getAddress() {
    axios.get('/health')
      .then((res) => {
        console.log(res);
        const plant = res.data;
        this.setState({ address: plant.address });
      });
  }

  render() {
    const style = { width: 600, height: 500, marginLeft: 'auto', marginRight: 'auto' };
    const { userLoc } = this.state;
    return (
      <div>
        <div
          id="map"
          style={style}
        />
        <MapView userLocation={userLoc} />
      </div>
    );
  }
}

export default MapViewContainer;
