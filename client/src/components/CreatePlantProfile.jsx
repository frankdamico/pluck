import React from 'react';
import axios from 'axios';
import _ from 'lodash';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import API_URL from '../../../config'
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Redirect } from 'react-router-dom';
import config from '../../../config';
import Downshift from 'downshift';
const Typeahead = require('react-typeahead').Typeahead;

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    display: 'none',
  },
});

// for drop down
let currencies = [
  {
    value: 'Strawberries',
    label: 'Strawberries',
  },
  {
    value: 'Oranges',
    label: 'Oranges',
  },
  {
    value: 'Figs',
    label: 'Figs',
  },
  {
    value: 'Tomatoes',
    label: 'Tomatoes',
  },
  {
    value: 'Squash',
    label: 'Squash',
  },
  {
    value: 'Rosemary',
    label: 'Rosemary',
  },
  {
    value: 'Snap Peas',
    label: 'Snap Peas',
  },
  {
    value: 'Apples',
    label: 'Apples',
  },
  {
    value: 'Basil',
    label: 'Basil',
  },
  {
    value: 'Peaches',
    label: 'Peaches',
  },
];

let currencyNames = [];

axios.get('/plantnames').then((result) => {
  const plantArray = [];
  _.forEach(result.data, (plantname) => {
    const obj = {};
    obj.value = plantname;
    plantArray.push(obj);
  });
  currencyNames = result.data;
  currencies = plantArray;
}).catch((err) => {
  console.log(err);
});

class PlantProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // type: '',
      description: '',
      image: '',
      loggedIn: false,
      currency: 'Select',
      username: props.username,
      plantAddress: '',
      plantZipcode: '',
      plantName: '',
    };
    this.getPlantType = this.getPlantType.bind(this);
    this.fileSelectHandler = this.fileSelectHandler.bind(this);
    this.submitPlant = this.submitPlant.bind(this);
    this.onChange = this.onChange.bind(this);
    this.console = this.console.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.setState = this.setState.bind(this);
    // this.fileUploadHandler = this.fileUploadHandler.bind(this);
  }


  // function that sets state via onchange
  // allows us to grab the plant type and description
  onChange(event) {
    // find out if descrip field is being used ///
    console.log(event.target.id);
    if (event.target.id === 'description') {
      this.setState({
        description: event.target.value,
      });
    } else if (event.target.id === 'plantAddress') {
      this.setState({
        plantAddress: event.target.value,
      });
    } else if (event.target.id === 'plantZipcode') {
      this.setState({
        plantZipcode: event.target.value,
      });
    } else if (event.target.id === 'plantName' || event.target.id === 'downshift-0-input' || _.includes(event.target.id, 'downshift-0-item-')) {
      if (_.includes(event.target.id, 'downshift-0-item-')) {
        return this.setState({
          plantName: event.target.innerText,
        });
      }
      this.setState({
        plantName: event.target.value,
      });
    }
  }

  console() {
    console.log(true);
  }

  // get req to server to grab correct image based on selected type
  getPlantType() {
    axios.get(`/plant/category?category=${this.state.currency}`) // currency is plant type
      .then((res) => {
        console.log(res);
        const plantImage = res.data[0];
        this.setState({ image: plantImage }); // this is not working yet
      });
  }


  handleChange(name) {
    return (event) => {
      this.setState({
        [name]: event.target.value, // this is for the plant type dropdown... it works...
      });
    };
  }


  ////////////////// THESE FUNCTIONS ARE USED TO ENABLE USER IMAGE UPLOAD ////////////////
  ///// which does not currently work /////////////
  //// another option would be to grab plant images from a plant api /////////////

  // function allows users to upload image
  fileSelectHandler(event) {
    const currentImage = event.target.files[0];

    this.setState({
      image: currentImage,
    });
  }

  // function upload image to our server
  // fileUploadHandler() {
  //   const fd = new FormData();
  //   fd.append('image', this.state.image, this.state.image.name);

  //   const fr = new FileReader();
  //   const file = this.state.image;
  //   // fr.readAsBinaryString(file);
  //   // fr.readAsDataURL(file); //base64

  //   const params = {
  //     image: fr.readAsBinaryString(file), // this needs to be binary, base64 data, or a url
  //     // type: 'application/file',
  //     headers: {
  //       Authorization: `Client-ID ${config.clientId} Bearer ${config.imgurKey}`, // this is correct
  //     },
  //   };

  //   // post request to imgur
  //   // goal: upload a user image and get back a url
  //   axios.post('https://api.imgur.com/3/image', params)
  //     .then((res) => {
  //       console.log(res.data.link);

  //       // set state to image url
  //       this.setState({
  //         image: res.data.link,
  //       });
  //     })
  //     .catch((err) => { console.log(err); });
  // }

  /////////////////////////////////////////////////////////////////////////////


  // function when submit button is pressed
  submitPlant() {
    const {
      currency,
      description,
      image,
      username,
    } = this.state;

    // change state to redirect to myProfile

    // send post req to server to save new plant info in plants table
    // add plant to users profile page
    // need to send through userId, type, description, address, zipcode, image
    // axios.post('/plant/profile', { currency, description, image, username })
    axios({
      method: 'post',
      url: '/plant/user',
      data: {
        username: this.state.username,
        currency: this.state.plantName,
        address: this.state.plantAddress,
        zipcode: this.state.plantZipcode,
        description: this.state.description,
      },
    })
      .then((res) => { 
        this.props.getAllPlants();
        console.log(res);
      })
      .catch((err) => { console.log(err); });

    // set state is async so needs a second to load
    setTimeout(() => {
      this.setState({
        redirect: true,
      });
    }, 1000);
  }

  render() {
    const { classes } = this.props;
    const { redirect } = this.state;

    if (redirect === true) {
      return <Redirect to={{ pathname: '/myProfile' }} />;
    }

    console.log(this.state.plantName);
    return (
      <div className="zip-body">
        <form className={classes.container} noValidate autoComplete="on">
          {/* <Typeahead className={classes.textField} options={currencyNames} maxVisible={7} /> */}
          <Downshift
            itemToString={item => (item ? item.value : '')}
          >
            {({
              getInputProps,
              getItemProps,
              getLabelProps,
              getMenuProps,
              isOpen,
              inputValue,
              highlightedIndex,
              selectedItem,
            }) => (
              <div>
                <TextField id="plantName" label="Plant Name" className={classes.textField} margin="normal" variant="standard" onInput={this.onChange} SelectProps={{ MenuProps: { className: classes.menu } }} {...getInputProps()} />
                <div className="dropdown-holder" {...getMenuProps()} onClick={this.onChange}>
                  {isOpen
                    ? currencies
                      .filter(item => !inputValue || item.value.toLowerCase().includes(inputValue.toLowerCase()))
                      .map((item, index) => (
                        <div
                          className="dropdown-item"
                          {...getItemProps({
                            key: item.value,
                            index,
                            item,
                            style: {
                              backgroundColor:
                                highlightedIndex === index ? 'lightgray' : 'white',
                              fontWeight: selectedItem === item ? 'bold' : 'normal',
                            },
                          })}
                        >
                          {item.value}
                        </div>
                      ))
                    : null}
                </div>
              </div>
            )}
          </Downshift>
        </form>
        <form className={classes.container} noValidate autoComplete="off">
          <TextField id="plantAddress" label="Address" className={classes.textField} margin="normal" variant="standard" onChange={this.onChange} SelectProps={{ MenuProps: { className: classes.menu } }} />
          <TextField id="plantZipcode" label="Zipcode" className={classes.textField} margin="normal" variant="standard" onChange={this.onChange} SelectProps={{ MenuProps: { className: classes.menu } }} />
          <TextField
            id="description"
            label="description"
            multiline
            rows="4"
            className={classes.textField}
            margin="normal"
            variant="standard"
            onChange={this.onChange}
            SelectProps={{
              MenuProps: {
                className: classes.menu,
              },
            }}
          />
        </form>
        <Button
          variant="contained"
          className={classes.button}
          onClick={this.submitPlant}
        >
                Submit
        </Button>
      </div>
    );
  }
}

// PlantProfile.propTypes = {
//     classes: PropTypes.object.isRequired
// };

export default withStyles(styles)(PlantProfile);