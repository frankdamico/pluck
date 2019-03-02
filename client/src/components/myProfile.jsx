import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import CancelIcon from '@material-ui/icons/Cancel';
import Chip from '@material-ui/core/Chip';
import classNames from 'classnames';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import green from '@material-ui/core/colors/green';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import NavigationIcon from '@material-ui/icons/Navigation'
import {
  Button, Card, CardHeader, CardMedia, CardContent, CardActions,
  Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, Fab, FormGroup, FormControlLabel, IconButton, Snackbar,
  SnackbarContent, TextField, withStyles, Typography, Switch } from '@material-ui/core';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

const styles = {
  root: {
    width: '100%',
    maxWidth: 500,
    padding: 50,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  fab: {
    margin: 0,
    bottom: 50,
    left: 50,
    position: 'fixed',
  },
};
// variantIcon and styles1 for snackbar
const variantIcon = {
  success: CheckCircleIcon,
};

const styles1 = theme => ({
  success: {
    backgroundColor: green[600],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
});

class MyProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: props.username,
      zipcode: props.zipcode,
      userPlants: props.plants,
      open: false,
      description: '',
      image: '',
      loggedIn: false,
      currency: 'Select',
      userId: this.props.id,
      checkedB: true, // for the toggle
      liked: true, // like button
    };
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.deleteButton = this.deleteButton.bind(this);
    this.handleLike = this.handleLike.bind(this); // like button
    this.handleToggle = this.handleToggle.bind(this); // checkbox for plant to be "on"
  }

  // render username, zip, and user plants dynamically
  // Get user plant on profile mount
  componentDidMount() {
    const componentThis = this;
    axios({
      method: 'get',
      url: `/user/profile?username=${componentThis.state.username}`,
    }).then((aResponse) => {
      componentThis.setState({ userPlants: aResponse.data });
    }).catch((err) => {
      console.log(err);
    });
  }

  // remove plant from your plants completely
  deleteButton(plantId) {
    console.log('delete button clicked');
    console.log(this.state.userId);
    console.log('works', plantId);
    const { userId } = this.state;
    axios({
      method: 'delete',
      url: '/plant',
      data: {
        username: userId,
        idplant: plantId,
      },
    })
      .then(() => {
        console.log('plant removed');
        this.componentDidMount();
      })
      .catch((err) => { console.log('could not delete plant', err); });
  }

  // for the form that adds a plant demo version
  handleClickOpen() {
    this.setState({ open: true });
  }

  handleClose() {
    this.setState({ open: false });
  }

  // like button
  handleLike(plantId, bool) {
    console.log('like button toggled');
    console.log(plantId, bool);
  }

  // toggle plant on and off for plucking
  handleToggle(plantId) {
    console.log('checkbox for plucking');
    console.log(plantId);
    axios({
      method: 'put',
      url: '/toggle',
      data: {
        idplant: plantId,
      },
    })
      .then(() => {
        console.log('plant plucking toggle clicked');
      })
      .catch((err) => { console.log(`plant plucking toggle unsuccessful due to ${err}`); });
  }


  // render username, zip, and user plants dynamically
  render() {
    const { classes, handleChange } = this.props;
    return (
      <div className={classes.root}>
        <div>
          {/* <Fab color="primary" aria-label="Add a Plant" className={classes.fab}>
          <NavigationIcon className={classes.extendedIcon}
            <AddIcon onclick={this.submitPlant} />add plant
          </Fab> */}
          <Fab component={Link} to="/submitPlant" color="primary" size="medium" variant="extended" aria-label="Add a Plant" className={classes.fab} styles={styles.fab}>
            {/* <NavigationIcon className={classes.extendedIcon} /> */}
        Add a Plant
            {/* <ContentAdd /> */}
          </Fab>
        </div>
        <Typography
          variant="h5"
          gutterBottom
          // align="center"
        >
          {this.state.username.toUpperCase()}
        </Typography>
        <div className={classes.root}>

          <Typography
            variant="subtitle1"
            gutterBottom
          >
          Your Plants
          </Typography>

          {this.state.userPlants === undefined ? null : this.state.userPlants.map((plant) => {
            return (
              <Card className={classes.card} key={plant.id}>
                <CardHeader
                  title={plant.title}
                />
                <CardMedia
                  className={classes.media}
                  image={plant.imagelink}
                  title={plant.title}
                />
                <CardContent>
                  <Typography component="p">
                    {plant.address}, {plant.zipcode} <br />
                    {plant.description}
                  </Typography>
                </CardContent>
                <IconButton aria-label="delete this plant" onClick={() => {this.deleteButton(plant.id)}}>
                  <DeleteOutlinedIcon className={classes.icon} />
                </IconButton>
                <FormControlLabel
                  control={(
                    <Checkbox
                      icon={<CheckBoxIcon fontSize="small" />}
                      checkedIcon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                      value="checkedI"
                      onClick={() => {
                        this.handleToggle(plant.id);
                      }}
                    />
                  )}
                  label="Ready for Plucking"
                />
              </Card>
            );
          })
          }
        </div>
      </div>
    );
  }
}


export default withStyles(styles)(MyProfile);
