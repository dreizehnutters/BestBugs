import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';

import Widgets from "./Widgets";
/**
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
**/
import { withCookies, Cookies } from 'react-cookie';

import * as StudioApi from "../services/client/ml-studio-api";

import * as Constants from "../constants";

const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: theme.spacing.unit * 4,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  center: {
    marginTop: theme.spacing.unit * 4,
    padding: theme.spacing.unit * 2
  },
  tiles: {
    width: "100%"
  },
  image: {
    width: 128,
    height: 128,
  },
});

class Dashboard extends Component {
  constructor(props) {
    super(props);

    const { cookies } = this.props;

    this.state = {
      textFieldValue:"",
      widgetdata: Constants.WIDGET_ITEMS_DASHBOARD
    };

   // this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.updateData = this.updateData.bind(this);

    this.updateData();
  }
  /**
  handleSubmit = (event) => {
    event.preventDefault();
    console.log(this,window);
    StudioApi.textClassificationCall(this.state.textFieldValue,this.state.limit)
    .then((data) => {
      const result = data.data
      if (result.length > 0) {
        var ind = 0;
        result.map(row => {

          row["id"] = ind;
          row["score"] = Number(row["score"]).toFixed(2);
          ind += 1;
        } )

        this.setState({
          rows: result
        })


      }
    });
  }
  **/
  updateData(props) {

    StudioApi.getCurrentData()
    .then((data) => {
      var stats = data;
      let widgetdata = this.state.widgetdata;

      widgetdata.forEach(function(element) {
        element.VALUE = stats[element.KEY] + element.FORMAT;
      }, this);

      this.setState({
        widgetdata: widgetdata
      });

      });
  }

  reloadData() {
    this.updateData(this.props);
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    })
  }

  componentWillReceiveProps(props){
    console.log("hallo");
  }

  render() {
    const { classes } = this.props;

    return (
      <div>

        <div className={classes.root}>
          <Paper className={classes.center}>
            <Grid container spacing={24}>
              <Paper className={classes.paper}>
                <Grid container spacing={16}>
                  <Grid item>
                    <ButtonBase className={classes.image}>
                      <img className={classes.img} alt="complex" src="../images/small_insect.png" />
                    </ButtonBase>
                  </Grid>
                  <Grid item xs={12} sm container>
                    <Grid item xs container direction="column" spacing={16}>
                      <Grid item xs>
                        <Typography gutterBottom variant="subtitle1">
                          Standard license
                        </Typography>
                        <Typography gutterBottom>Full resolution 1920x1080 • JPEG</Typography>
                        <Typography color="textSecondary">ID: 1030114</Typography>
                      </Grid>
                      <Grid item>
                        <Typography style={{ cursor: 'pointer' }}>Remove</Typography>
                      </Grid>
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1">$19.00</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Paper>
        </div>
      </div>
    );
  };
}

Dashboard.propTypes = {
    classes: PropTypes.object.isRequired,
    cookies: PropTypes.instanceOf(Cookies).isRequired,
  };

export default withCookies(withStyles(styles)(Dashboard));
