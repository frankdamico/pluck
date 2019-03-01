import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import black from '@material-ui/core/colors/grey'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { NavLink, Redirect } from 'react-router-dom'; 
import classNames from "classnames";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

// STATIC NAV BAR AT THE TOP OF EVERY PAGE

const drawerWidth = 240;

const theme = createMuiTheme({
  palette: {
    primary: { main: black[900] },
    secondary: { main: '#11cb5f' }, // This is just green.A700 as hex.
  },
  typography: { color: 'white' },
});

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  color: {
    color: 'green',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
};

class ButtonAppBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
    this.handleDrawerClose = this.handleDrawerClose.bind(this);
  }

  // Drawer = left side pop out navigation
  handleDrawerOpen() {
    this.setState({
      open: true,
    });
  }

  handleDrawerClose() {
    this.setState({ open: false });
  }

  render() {
    const { classes, signUser, logUser } = this.props;
    const { open } = this.state;


    return (
      <div className={classes.root}>
        <MuiThemeProvider theme={theme}>
          <AppBar
            position="static"
            className={classNames(classes.appBar, {
              [classes.appBarShift]: open,
            })}
          >
            <Toolbar disableGutters={!open}>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={this.handleDrawerOpen}
                className={classNames(classes.menuButton, open && classes.hide)}
              >
                <MenuIcon />
              </IconButton>
              <NavLink to="/"> <img className="logo" src={require('../images/pluck.png')}></img></NavLink>
              <Typography variant="h6" color="inherit" className={classes.grow}>
                        p l u c k
              </Typography>

              <NavLink to="/userProfile" style={{ color: 'white', textDecoration: 'none' }}> <Button color="inherit" onClick={signUser}>Signup</Button> </NavLink>
              <NavLink to="/userLogin" style={{ color: 'white', textDecoration: 'none' }}><Button color="inherit" onClick={logUser}>Login / Logout</Button> </NavLink>
            </Toolbar>
          </AppBar>
          <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={open}
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <div className={classes.drawerHeader}>
              <IconButton onClick={this.handleDrawerClose}>
                {theme.direction === 'ltr' ? (
                  <ChevronLeftIcon />
                ) : (
                  <ChevronRightIcon />
                )}
              </IconButton>
            </div>
            <Divider />
            <List>

              <NavLink
                to="/MyProfile"
                style={{ textDecoration: 'none' }}
              >
                <ListItem button key="My Profile">
                  <ListItemText primary="My Profile" />
                </ListItem>
              </NavLink>

              <NavLink to="/submitPlant" style={{ textDecoration: 'none' }}>
                <ListItem button key="Submit New Plant">
                  <ListItemText primary="Submit New Plant" />
                </ListItem>
              </NavLink>

              <NavLink to="/" style={{ textDecoration: 'none' }}>
                <ListItem button key="Change Location">
                  <ListItemText primary="Change Location" />
                </ListItem>
              </NavLink>

            </List>
          </Drawer>
        </MuiThemeProvider>
      </div>
    );
  }
}


// ButtonAppBar.propTypes = {
//     classes: PropTypes.object.isRequired,
// };

export default withStyles(styles)(ButtonAppBar);
