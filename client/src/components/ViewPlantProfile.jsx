import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { NavLink } from 'react-router-dom'; 
import axios from 'axios';

const x = document.getElementById('demo');

const styles = theme => ({
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
    };
    this.favoriteButton = this.favoriteButton.bind(this);
    this.getDirections = this.getDirections.bind(this);
    this.getLocation = this.getLocation.bind(this);
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
            {plant.description}
          </Typography>
        </CardContent>
        <CardActions className={classes.actions} disableActionSpacing>
          <IconButton aria-label="Add to favorites" onClick={this.favoriteButton}>
            <FavoriteIcon />
          </IconButton>
          <NavLink to="/plantLocation" style={{ textDecoration: 'none' }}>
            <Button variant="contained" onClick={this.getLocation} className={classes.button}>
                Get Directions
            </Button>
          </NavLink>
        </CardActions>
      </Card>
    );
  }
}

// ViewPlantProfile.propTypes = {
//   classes: PropTypes.object.isRequired,
// };

export default withStyles(styles)(ViewPlantProfile);
