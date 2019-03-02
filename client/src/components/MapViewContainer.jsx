import React from 'react';
import axios from 'axios';
import MapView from './MapView.jsx';

class MapViewContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        zoom: 13,
        bearing: 0,
        pitch: 0,
        width: 500,
        height: 500,
      },
      // popupInfo: null,
    };
    this.getAddress = this.getAddress.bind(this);
    this.onViewportChange = this.onViewportChange.bind(this);
    this.getLocation = this.getLocation.bind(this);
  }

  componentDidMount() {
    this.getLocation();
  }

  onViewportChange(viewport) {
    this.setState({ viewport });
  }

  getLocation() {
    if (navigator.geolocation) {
      console.log('Geolocation is supported!');
      const geoOptions = {
        timeout: 10 * 1000,
      };
      const geoSuccess = (position) => {
        const currentLoc = [position.coords.latitude, position.coords.longitude];
        const [latitude, longitude] = currentLoc;
        this.setState(({ viewport }) => ({
          viewport: {
            latitude,
            longitude,
            ...viewport,
          },
        }));
      };
      const geoError = (error) => {
        console.log('Error occurred. Error code: ', error.code);
      };

      navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
    } else {
      console.log('Geolocation is not supported for this Browser/OS.');
    }
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
    const { viewport } = this.state;
    return (
      <div>
        <div>Hello World</div><br />
        <div
          // id="map"
          // style={style}
        />
        <MapView viewport={viewport} onViewportChange={this.onViewportChange} allPlants={this.props.allPlants} />
      </div>
    );
  }
}

export default MapViewContainer;
