import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import { Chart } from "react-google-charts";

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
  }
});

class Container extends Component {
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
          <Widgets data={this.state.widgetdata} />
          <Paper className={classes.center}>
              <Chart
                width={'600px'}
                height={'400px'}
                chartType="LineChart"
                loader={<div>Loading Chart</div>}
                data={[
                  ['x', 'dogs', 'cats'],
                  [0, 0, 0],
                  [1, 10, 5],
                  [2, 23, 15],
                  [3, 17, 9],
                  [4, 18, 10],
                  [5, 9, 5],
                  [6, 11, 3],
                  [7, 27, 19],
                ]}
                options={{
                  hAxis: {
                    title: 'Time',
                  },
                  vAxis: {
                    title: 'Popularity',
                  },
                  series: {
                    1: { curveType: 'function' },
                  },
                }}
                rootProps={{ 'data-testid': '2' }}
              />
          </Paper>
        </div>
      </div>
    );
  };
}

Container.propTypes = {
    classes: PropTypes.object.isRequired,
    cookies: PropTypes.instanceOf(Cookies).isRequired,
  };

export default withCookies(withStyles(styles)(Container));
