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
import BlockHeader from "./BlockHeader";
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
  chart: {
    width: "100%",
    height: "100%",
    minHeight: "450px"
  }
});

class Container extends Component {
  constructor(props) {
    super(props);

    const { cookies } = this.props;

    this.state = {
      textFieldValue:"",
      widgetdata: Constants.WIDGET_ITEMS_DASHBOARD,
      charts:[
        {
          "name":"moisture",
          "x_axis":"Time",
          "y_axis":"Moisture",
          "data":[
                  ['x', 'moisture'],
                  [0, 0],
                  [1, 10],
                  [2, 23],
                  [3, 17],
                  [4, 18],
                  [5, 9],
                  [6, 11],
                  [7, 27],
                ],
          "color":['blue']

        },
        {
          "name":"temperature",
          "x_axis":"Time",
          "y_axis":"Temperature",
          "data":[
                  ['x', 'temp'],
                  [0, 0],
                  [1, 10],
                  [2, 23],
                  [3, 17],
                  [4, 18],
                  [5, 9],
                  [6, 11],
                  [7, 27],
                ],
          "color":['red']

        },
      ] 
    };

   // this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.updateData = this.updateData.bind(this);

    this.updateData();
  }

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

    StudioApi.getHistoryData()
    .then((data) => {
      var stats = this.state.charts;
      let chart_data = this.state.charts;

      stats.forEach(function(element) {
        console.log(element);
      }, this);

      this.setState({
        charts: chart_data
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

    const charts = this.state.charts.map((data) =>
        <Grid item xs={12} sm={6} md={this.props.colSize} lg={this.props.colSize}>
              <Chart
                className={classes.chart}
                chartType="LineChart"
                loader={<div>Loading Chart</div>}
                data={data.data}

                options={{
                  hAxis: {
                    title: data.x_axis,
                  },
                  vAxis: {
                    title: data.y_axis,
                  },
                  series: {
                    1: { curveType: 'function' },
                  },
                  legend: {position: 'none'},
                  colors: data.color, 
                }}
                rootProps={{ 'data-testid': '2' }}
              />
        </Grid>
    );

    return (
      <div>

        <div className={classes.root}>
          <BlockHeader name="Container 1" />
          <Widgets data={this.state.widgetdata} />
          <Paper className={classes.center}>
          <Grid container spacing={24}>
              {charts}
            </Grid>
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
