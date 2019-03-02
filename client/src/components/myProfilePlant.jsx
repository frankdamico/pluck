import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const styles = {
  card: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
};

function MyProfilePlant(props) {
  const { classes } = props;
  const { plants } = props;
  const bull = <span className={classes.bullet}>•</span>;

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          Word of the Day
          {plants[0].description}
        </Typography>
        <Typography variant="h5" component="h2">
          be
          {bull}
          nev
          {bull}o{bull}
          lent
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          adjective
        </Typography>
        <Typography component="p">
          well meaning and kindly.
          <br />
          {'"a benevolent smile"'}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}

MyProfilePlant.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MyProfilePlant);





// import React from 'react';
// import axios from 'axios';
// import {
//   Button,
//   Card, CardHeader, CardMedia, CardContent, CardActions,
//   Checkbox, CheckBoxOutlineBlankIcon, CheckBoxIcon,
//   Dialog, DialogActions, DialogContent, DialogContentText,
//   DialogTitle, FormGroup, FormControlLabel, IconButton, Snackbar,
//   SnackbarContent, TextField, withStyles, Typography, Switch
// } from '@material-ui/core';
// import CheckCircleIcon from '@material-ui/icons/CheckCircle';
// import Favorite from '@material-ui/icons/Favorite';
// import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
// import PropTypes from 'prop-types';

// const styles = {
//   root: {
//     width: '100%',
//     maxWidth: 500,
//     padding: 50,
//   },
//   media: {
//     height: 0,
//     paddingTop: '56.25%', // 16:9
//   },
// };
// // variantIcon and styles1 for snackbar
// const variantIcon = {
//   success: CheckCircleIcon,
// };

// const styles1 = theme => ({
//   success: {
//     backgroundColor: green[600],
//   },
//   icon: {
//     fontSize: 20,
//   },
//   iconVariant: {
//     opacity: 0.9,
//     marginRight: theme.spacing.unit,
//   },
//   message: {
//     display: 'flex',
//     alignItems: 'center',
//   },
// });

// class MyProfilePlant extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       checkedB: true, // for the toggle
//     };
//     this.deleteButton = this.deleteButton.bind(this);
//     this.toggleButton = this.toggleButton.bind(this);
//     this.handleLike = this.handleLike.bind(this); // like button
//   }

//   // remove plant from your plants completely
//   deleteButton(plantId) {
//     console.log('delete button clicked');
//     console.log(this.state.userId);
//     console.log('works', plantId);
//     const { userId } = this.state;
//     axios({
//       method: 'delete',
//       url: '/plant',
//       data: {
//         username: userId,
//         idplant: plantId,
//       },
//     })
//       .then(() => {
//         console.log('plant removed');
//       })
//       .catch((err) => { console.log('could not delete plant', err); });
//   }

//   // for toggle plant
//   // changed from double arrow, may not work!!
//   handleChange(name) {
//     return event => this.setState({ [name]: event.target.checked });
//   }

//   // like button
//   handleLike(plantId, bool) {
//     console.log('like button toggled');
//     console.log(plantId, bool);
//   }

//   render() {
//     const { plant, classes } = this.props;
//     // const { classes } = this.props;
//     return (
//       <div className="plant-card">
//       <Card className={classes.card} key={plant.id}>
//         <CardHeader
//           title={plant.title}
//         />
//         <CardMedia
//           className={classes.media}
//           image={plant.imagelink}
//           title={plant.title}
//         />
//         <CardContent>
//           <Typography component="p">
//             {plant.description}
//           </Typography>
//         </CardContent>
//         <IconButton aria-label="delete this plant" onClick={() => { this.deleteButton(plant.id) }}>
//           <DeleteOutlinedIcon className={classes.icon} />
//         </IconButton>
//         <IconButton aria-label="toggle on and off" onClick={this.toggleButton}>
//           {/* <Toggle style={iconStyles} color={red500} hoverColor={greenA200} /> */}
//           <FavoriteIcon />
//         </IconButton>
//         <FormControlLabel
//           control={
//             <Checkbox icon={<FavoriteBorder />} checkedIcon={<Favorite />} value="checkedH" onClick={() => {
//               this.handleLike(plant.id, false)
//             }} />
//           }
//           label="Like"
//         />
//         <FormControlLabel
//           control={
//             <Switch
//               classes={{
//                 switchBase: classes.iOSSwitchBase,
//                 bar: classes.iOSBar,
//                 icon: classes.iOSIcon,
//                 iconChecked: classes.iOSIconChecked,
//                 checked: classes.iOSChecked,
//               }}
//               disableRipple
//               checked={this.state.checkedB}
//               onChange={this.handleChange('checkedB')}
//               value="checkedB"
//             />
//           }
//           label="iOS style"
//         />
//       </Card>
//       </div>
//     );
//   }
// }

// MyProfilePlant.propTypes = {
//   classes: PropTypes.object.isRequired,
// };

// export default withStyles(styles)(MyProfilePlant);
