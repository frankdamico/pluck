import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { Redirect } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import axios from 'axios';

const styles = theme => ({
  container: {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 30,
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
  },
});

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      address: '',
      zipcode: '',
      redirect: false,
    };

    // bind functions to this
    this.onChange = this.onChange.bind(this);
    this.submitUserInfo = this.submitUserInfo.bind(this);
  }

  // function that sets state via onchange when user inputs data into input fields
  onChange(event) {
    // find which field is being used
    if (event.target.id === 'username') {
      // set corresponding state to the value entered into that field
      this.setState({
        username: event.target.value,
      });
    } else if (event.target.id === 'address') {
      this.setState({
        address: event.target.value,
      });
    } else if (event.target.id === 'zipcode') {
      this.setState({
        zipcode: event.target.value,
      });
    } else {
      this.setState({
        password: event.target.value,
      });
    }
  }

  // function that sends post req to server when submit is pressed
  submitUserInfo() {
    const {
      username, password, address, zipcode,
    } = this.state;
    console.log('user info submitted');
    console.log(username, password, address, zipcode);
    this.props.onSubmit({ username, password, address, zipcode }); // func from index.jsx to add user to db

    this.setState({
      redirect: true,
    });
  }

  render() {
    const { classes } = this.props;

    // if redirect is true, redirect to plant list page
    if (this.state.redirect === true) {
      return <Redirect to="/plantList" />;
    }
    // else, stay on userprofile page
    return (
      <div className="zip-body">
        <FormControl className={classes.formControl} variant="outlined">

          <InputLabel
            ref={(ref) => {
              this.labelRef = ReactDOM.findDOMNode(ref);
            }}
            htmlFor="address"
          > Address
          </InputLabel>

          <OutlinedInput
            id="address"
            onChange={this.onChange} // function that sets state of address
            labelWidth={this.labelRef ? this.labelRef.offsetWidth : 0}
          />

        </FormControl>

        <FormControl className={classes.formControl} variant="outlined">
          <InputLabel
            ref={(ref) => {
              this.labelRef = ReactDOM.findDOMNode(ref);
            }}
            htmlFor="zipcode"
          > Zipcode
          </InputLabel>

          <OutlinedInput
            id="zipcode"
            onChange={this.onChange} // function that sets state of username
            labelWidth={this.labelRef ? this.labelRef.offsetWidth : 0}
          />
        </FormControl>

        <FormControl className={classes.formControl} variant="outlined">
          <InputLabel
            ref={(ref) => {
              this.labelRef = ReactDOM.findDOMNode(ref);
            }}
            htmlFor="username"
          > Username
          </InputLabel>

          <OutlinedInput
            id="username"
            onChange={this.onChange} // function that sets state of username
            labelWidth={this.labelRef ? this.labelRef.offsetWidth : 0}
          />
        </FormControl>

        <FormControl className={classes.formControl} variant="outlined">
          <InputLabel
            ref={(ref) => {
              this.labelRef = ReactDOM.findDOMNode(ref);
            }}
            htmlFor="password"
          > Password
          </InputLabel>
                
          <OutlinedInput
            id="password"
            onChange={this.onChange} // function that sets state of password
            labelWidth={this.labelRef ? this.labelRef.offsetWidth : 0}
          />
        </FormControl>
        <div>
          <Button variant="contained" onClick={this.submitUserInfo} className={classes.button}>
                Submit
          </Button>
        </div>
      </div>
    );
  }
}

// UserProfile.propTypes = {
//     classes: PropTypes.object.isRequired,
// };

export default withStyles(styles)(UserProfile);
