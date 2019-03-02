import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
// import Comments from './Comments.jsx';
import {
  Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, FormGroup, FormControlLabel, Snackbar,
  SnackbarContent, TextField
} from '@material-ui/core';
// import { blue500, red500, greenA200 } from 'material-ui/styles/colors';
// import SvgIcon from 'material-ui/SvgIcon';

// const iconStyles = {
//   marginRight: 24,
// };

// const Toggle = props => (
//   <SvgIcon {...props}>
//     <path d="M17 7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h10c2.76 0 5-2.24 5-5s-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
//   </SvgIcon>
// );

const x = document.getElementById('demo');

const styles = theme => ({
  root: {
    color: theme.palette.text.primary,
  },
  icon: {
    margin: theme.spacing.unit,
    fontSize: 32,
    padding: '0%',
  },
  card: {
    maxWidth: 400,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  actions: {
    display: 'flex',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'center',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
});

class ViewPlantProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: props.userId,
      liked: false,
      comments: [],
    };
    this.favoriteButton = this.favoriteButton.bind(this);
    this.getDirections = this.getDirections.bind(this);
    this.getLocation = this.getLocation.bind(this);
    this.commentToggle = this.commentToggle.bind(this);
  }

  // doesnt work
  getDirections() {
    console.log('lets get directions');
    // get req to server for map view
    //   need enpoint from api
    //   should send address of plant
  }

  // gets location of current user https://www.w3schools.com/html/html5_geolocation.asp
  // need to find a way to get cordinates/location in Mapview.
  //    May moved function to MapView component
  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showPosition);
    } else {
      x.innerHTML = 'Geolocation is not supported by this browser.';
    }
  }

  // THIS IS CLOSE TO WORKING BUT NOT QUITE FUNCTIONAL
  favoriteButton() {
    console.log('favorite button clicked');
    // const { userId } = this.state;
    // const { plantId } = this.props;
    const { userId } = this.state;
    const plantId = this.props.plant.id;
    console.log(this);
    // post request to server
    //  add plant to users favs
    //  send user id + plant id
    // axios.put('/user/favorite', { userId, plantId })
    axios({
      method: 'put',
      url: '/likes',
      data: {
        iduser: '1' || this.state.userId,
        idplant: plantId || '1',
      },
    })
      .then((res) => { console.log(res); })
      .catch((err) => { console.log(err); });
  }


  showPosition(position) {
    // x.innerHTML = 'Latitude: ' + position.coords.latitude +
    // '<br>Longitude: ' + position.coords.longitude;
  }
  // linebreak isnt working in the temp lit
  // `Latitude: ${position.coords.latitude}
  // Longitude: ${position.coords.longitude}`;

  commentToggle() {
    console.log('commentToggle clicked');
    console.log(plant.id);
    // axios({
    //   method: 'get',
    //   url: '/plant/comments',
    //   data: {
    //     idplant: plantId || '1',
    //   },
    // })
    //   .then((res) => {
    //     console.log(res, 'returning comments');
    //     this.setState({
    //       comments: res.data, // check if retriving correct part of data
    //     });
    //     return <Comments comments={this.state.comments} />;
    //   })
    //   .catch((err) => { console.log(err, 'cannot get comments'); });
  }

  render() {
    const { classes, plant } = this.props;

    return (
      <Card className={classes.card}>
        <CardHeader
          title={plant.plant}
        />
        <CardMedia
          className={classes.media}
          image={plant.imagelink}
          title={plant.plant}
        />
        <CardContent>
          <Typography component="p">
            {plant.address}, {plant.zipcode} <br />
            {plant.description}
          </Typography>
        </CardContent>
        <CardActions className={classes.actions} disableActionSpacing>
          {/* <IconButton aria-label="Add to favorites" onClick={this.favoriteButton}>
            <FavoriteIcon />
          </IconButton> */}
          <FormControlLabel
            control={(
              <Checkbox
                icon={<FavoriteBorder />}
                checkedIcon={<Favorite />}
                value="checkedH"
                onClick={this.favoriteButton}
              />
            )}
            label="Like"
          />
          <NavLink to="/plantLocation" style={{ textDecoration: 'none' }}>
            <Button variant="contained" onClick={this.getLocation} className={classes.button}>
                Get Directions
            </Button>
          </NavLink>
          {/* <div onClick={() => {this.commentToggle()}} >
            <i class="far fa-comment-alt"></i>
            {/* <span style="font-size: 48px; color: Dodgerblue;"> */}
            {/* <span fontSize="48px" color="Dodgerblue">
              <i class="far fa-comment-alt"></i>
            </span>
            <input type="image" src={logo} width="7%" height="auto" onClick={() => this.changeView('search')} />
          </div> */} 
          {/* <IconButton aria-label="Add to favorites" onClick={this.favoriteButton}>
            
          </IconButton> */}
        </CardActions>
      </Card>
    );
  }
}

// ViewPlantProfile.propTypes = {
//   classes: PropTypes.object.isRequired,
// };

export default withStyles(styles)(ViewPlantProfile);