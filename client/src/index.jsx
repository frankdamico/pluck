import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ReactDOM from 'react-dom';
import axios from 'axios';
import NavBar from './components/Nav.jsx';
import UserProfile from './components/UserProfile.jsx';
import ZipCode from './components/Zip-code.jsx';
import './index.css';
import PlantList from './components/PlantList.jsx';
import UserLogin from './components/UserLogin.jsx';
import ViewPlantProfile from './components/ViewPlantProfile.jsx';
import CreatePlantProfile from './components/CreatePlantProfile.jsx';
import MyProfile from './components/myProfile.jsx';
import MapView from './components/MapView.jsx';
import MapViewContainer from './components/MapViewContainer.jsx';
// import SampleData from "./components/SampleData";


class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      plants: [],
      username: '',
      zipcode: '',
      userId: '',
      userPlants: [],
      allPlants: [],
    };

    // bind to this all functions being handed down
    this.zipCodeSubmit = this.zipCodeSubmit.bind(this);
    this.userLogin = this.userLogin.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getAllPlants = this.getAllPlants.bind(this);
  }

  componentDidMount() {
    // this.getAllPlants();
    this.forceUpdate(); // rerenders page when components state or props change
  }

  getALocation() {
    function displayLocationInfo(position) {
      const lng = position.coords.longitude;
      const lat = position.coords.latitude;

      console.log(`longitude: ${lng} | latitude: ${lat}`);
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(displayLocationInfo);
    }
  }

  // function gets called when submit button is clicked in zipcode view
  zipCodeSubmit(userZip) {
    // get req to server
    axios.get(`/zipcode?zipcode=${userZip.zipcode}`)
    // server will grab plants in this zipcode from db and send back
      .then((res) => {
        console.log('here', res.data);
        // data state in index component will be updated to those plants
        this.setState({
          plants: res.data,
        }); // method to redirect as second argument
      })
      .catch((err) => { console.log(err); });
  }

  // called in UserProfile when a user signs up/ hits submit button
  submitUserInfo(userInfo) {
    // get all user info from userProfile view
    // deconstruct vals
    const {
      username,
      password,
      address,
      zipcode,
    } = userInfo;
    // send post req to server to add new user to db
    axios.post('/newuser', {
      username,
      password,
      address,
      zipcode,
    })
      .then((res) => {
        console.log(res.data, 'RES DATA');
        // get all plants in new users zipcode
        this.zipCodeSubmit({ zipcode });
      })
      .catch((err) => { console.log(err); });
  }

  // called in UserLogin to allow user to log in when submit is pressed
  userLogin(userInfo) {
    // grab username and add to state
    this.setState({
      username: userInfo.username,
    });
    // get req to server to grab all user info
    // axios.get(`/user/login?username=${userInfo.username}&password=${userInfo.password}`)
    axios({
      method: 'put',
      url: '/user/login',
      data: {
        username: userInfo.username,
        password: userInfo.password,
      },
    })
      .then((res) => {
        // set states with all user info
        console.log(res.data);
        this.setState({
          userId: res.data.id,
          zipcode: res.data.zipcode,
          userPlants: res.data.plants,
        });

        // get all plants in new users zipcode
        this.getAllPlants();
        this.zipCodeSubmit({ zipcode: this.state.zipcode });
      })
      .catch((err) => { console.log(err); });
  }

  getAllPlants() {
    console.log('get all plants called');
    axios({
      method: 'get',
      url: '/toggledonplants',
    })
      .then((res) => {
        console.log(res);
        this.setState({
          allPlants: res.data,
        });
      })
      .catch((err) => {
        console.log(err, 'could not retrieve all plants');
      });
  }

  handleChange(name) {
    return (event) => {
      this.setState({ [name]: event.target.checked });
    };
  }

  render() {
    return (

      <div>
        <BrowserRouter>
          <div>

            <NavBar logUser={this.userLoginLogut} signUser={this.userSignUp} />
            <Switch>
              <Route path="/" render={() => <ZipCode onSubmit={this.zipCodeSubmit} />} exact />
              <Route path="/userProfile" render={() => <UserProfile plants={this.state.plants} onSubmit={this.submitUserInfo} />} />
              <Route path="/plantList" render={() => <PlantList plants={this.state.plants} />} />              <Route path="/plantList" component={MapViewContainer} />
              <Route path="/userLogin" render={() => <UserLogin plants={this.state.plants} zipcode={this.state.zipcode} onSubmit={this.userLogin} />} />
              <Route path="viewPlantProfile" render={() => <ViewPlantProfile userId={this.state.userId} />} />
              <Route path="/submitPlant" render={() => <CreatePlantProfile userId={this.state.userId} username={this.state.username} getAllPlants={this.getAllPlants} />} />
              <Route path="/myProfile" render={() => <MyProfile zipcode={this.state.zipcode} plants={this.state.userPlants} username={this.state.username} id={this.state.userId} handleChange={this.handleChange} />} />
              <Route path="/plantLocation" render={() => <MapViewContainer allPlants={this.state.allPlants} />} />

              <Route component={Error} />
            </Switch>
          </div>
        </BrowserRouter>
      </div>

    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
