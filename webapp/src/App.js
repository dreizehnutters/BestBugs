import React, { Component } from 'react';
import PropTypes from "prop-types";
import './App.css';
import { withRouter } from "react-router";
import { connect } from "react-redux";

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import Grid from "@material-ui/core/Grid";

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/ListItem';
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Icon from "@material-ui/core/Icon";
import Link from 'react-router-dom/Link';

import * as Constants from "./constants";
import ContentContainer from "./components/ContentContainer";

import { mapStateToProps } from "./reduxUtils";
import { withCookies, Cookies } from "react-cookie";
import ListItem from '@material-ui/core/ListItem';

const styles = theme => ({
  root: {
    width: '100%',
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200,
      },
    },
    avatar: {
    margin: 10,
  }
  },

  grid: {
    height: "90%"
  }
});

class App extends Component {
	constructor(props) {
      super(props);
      
      this.state = {
        anchorEl: null,
      };
    }

  handleClick = event => {
      this.setState({ anchorEl: event.currentTarget });
    };

  handleClose = () => {
      this.setState({ anchorEl: null });
    };
	

	render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;

	    return (
	      <div className={classes.root}>
	      <div>
	      <AppBar position="static">
	        <Toolbar>
            <IconButton 
              className={classes.menuButton} 
              color="inherit" 
              aria-label="Open menu"
              onClick={this.handleClick}>
	            <MenuIcon />
	          </IconButton>
            <Menu
              id="demo-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={this.handleClose}
            >
              {Constants.NAVBAR_ITEMS.map(item => {
                  console.log(item);
                  return (<ListItem key={item.NAME} component={Link} to={item.PATH} button onClick={this.handleClose}>
                    
                    <ListItemIcon>
                      <Icon>{item.ICON}</Icon>
                    </ListItemIcon>
                  <ListItemText disableTypography >
                    {item.NAME}
                  </ListItemText>
                  </ListItem>);
              })}
            </Menu>
	          <Typography className={classes.title} variant="h6" color="inherit" noWrap>
	            {Constants.DEMO_HEADER}
	          </Typography>
	          <div className={classes.grow} />
	          <div className={classes.search}>
	            <div className={classes.searchIcon}>
	              <SearchIcon />
	            </div>
	            <InputBase
	              placeholder="Search…"
	              classes={{
	                root: classes.inputRoot,
	                input: classes.inputInput,
	              }}
	            />
	          </div>
	        </Toolbar>	
	      </AppBar>
	      </div>
        <div>
          <ContentContainer />
        </div>
	    </div>

      
    );
  }
}


App.propTypes = {
  cookies: PropTypes.instanceOf(Cookies).isRequired,
  classes: PropTypes.object.isRequired,
};

export default withRouter(withCookies(connect(mapStateToProps)(withStyles(styles)(App))));
