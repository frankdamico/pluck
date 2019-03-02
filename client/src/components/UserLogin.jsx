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

class UserLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      redirect: false,
      loggedIn: false,
      userId: '',
      zipcode: props.zipcode,
    };

    // bind functions to this
    this.onChange = this.onChange.bind(this);
    this.submitUserInfo = this.submitUserInfo.bind(this);
  }

  // function that sets state via onchange
  onChange(event) {

    // find which field is being used
    if (event.target.id === 'username') {
      // set corresponding state to the value entered into that field
      this.setState({
        username: event.target.value,
      });
    } else {
      this.setState({
        password: event.target.value,
      });
    }
  }

  // function that sends get req to server to retrieve user info
  submitUserInfo() {
    const { username, password } = this.state;
    this.props.onSubmit({ username, password }); // function from index.jsx --> gets plants from users zip
    axios({
      method: 'put',
      url: '/user/login',
      data: {
        username: username,
        password: password,
      },
    }).then((result) => {
      this.setState({
        redirect: true,
        loggedIn: true,
      });
    }).catch((err) => {
      console.log(err);
    });
    // brought to list view
    // set state of redirect and loggedin to true
    // set state is async, hence the set timeout (there is a better way to do this)
  }


  render() {
    const { classes } = this.props;

    if (this.state.redirect === true && this.state.loggedIn === true) {
      return <Redirect to="/plantLocation" />;
    }

    return (
      <div className="zip-body">

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
            // onKeyPress={this.submitUserInfo} // function that sends post req to server w user info
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

// UserLogin.propTypes = {
//   classes: PropTypes.object.isRequired,
// };

export default withStyles(styles)(UserLogin);
