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
import Dialogs from "./Dialogs";

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import OpacityIcon from '@material-ui/icons/Opacity';
import PizzaIcon from '@material-ui/icons/LocalPizza';

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
  },
  button: {
    margin: theme.spacing.unit * 1
  },
  warning: {
    backgroundColor: '#f44336'
  },
  good: {
    backgroundColor: '#10af09'
  }
});

class Container extends Component {
  constructor(props) {
    super(props);

    const { cookies } = this.props;

    //this.child = React.createRef();

    this.state = {
      textFieldValue:"",
      dialog_open: false,
      widgetdata: Constants.WIDGET_ITEMS_DASHBOARD,
      charts:[
        {
          "name":"moisture",
          "x_axis":"Time",
          "y_axis":"Moisture in %",
          "title":"Moisture over Time",
          "data":[
                  ['time', 'moisture'],
                  [new Date(2019, 1 ,1, 13, 10), 0],
                  [new Date(2019, 1 ,1, 14, 10), 10],
                  [new Date(2019, 1 ,1, 15, 10), 23],
                  [new Date(2019, 1 ,1, 16, 10), 17],
                  [new Date(2019, 1 ,1, 17, 10), 18],
                  [new Date(2019, 1 ,1, 18, 10), 9],
                  [new Date(2019, 1 ,1, 19, 10), 11],
                  [new Date(2019, 1 ,1, 20, 10), 27],
                ],
          "color":['blue']

        },
        {
          "name":"temperature",
          "x_axis":"Time",
          "y_axis":"Temperature in °C",
          "title":"Temperature over Time",
          "data":[
                  ['time', 'temperature'],
                  [new Date(2019, 1 ,1, 13, 10), 0],
                  [new Date(2019, 1 ,1, 14, 10), 3],
                  [new Date(2019, 1 ,1, 15, 10), 6],
                  [new Date(2019, 1 ,1, 16, 10), 8],
                  [new Date(2019, 1 ,1, 17, 10), 13],
                  [new Date(2019, 1 ,1, 18, 10), 16],
                  [new Date(2019, 1 ,1, 19, 10), 13],
                  [new Date(2019, 1 ,1, 20, 10), 12],
                ],
          "color":['red']

        },
      ] 
    };

   // this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.updateData = this.updateData.bind(this);
    this.onFeedClick = this.onFeedClick.bind(this);

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

    var that = this;
    setTimeout(function(){
        console.log("wait");
        StudioApi.getHistoryData()
        .then((data) => {
          console.log(data);
          if(data["hist_moist"].length > 2){
            let chart_data = that.state.charts;

            chart_data[0].data = [['time', 'moisture']].concat(data["hist_moist"].map(x => [new Date(
              x[0].slice(0,2),
              x[0].slice(3,5),
              x[0].slice(6,10),
              x[0].slice(11,13),
              x[0].slice(14,16),
              x[0].slice(17,19)),x[1]]));
            chart_data[1].data = [['time', 'temperature']].concat(data["hist_temp"].map(x => [new Date(
              x[0].slice(0,2),
              x[0].slice(3,5),
              x[0].slice(6,10),
              x[0].slice(11,13),
              x[0].slice(14,16),
              x[0].slice(17,19)),x[1]]));

            that.setState({
              charts: chart_data
            });
          }

          

          });
    }, 2000);

    
  }

  reloadData() {
    this.updateData(this.props);
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    })
  }

  onFeedClick(){
    this.setState({
      dialog_open:true
    })
  };

  //componentWillReceiveProps(props){
  //  console.log("hallo");
  //}

  render() {
    const { classes } = this.props;

    const charts = this.state.charts.map((data) =>
        <Grid key={data.title} item xs={12} sm={6} md={this.props.colSize} lg={this.props.colSize}>
              <Chart
                className={classes.chart}
                chartType="LineChart"
                loader={<div>Loading Chart</div>}
                data={data.data}

                options={{
                  hAxis: {
                    title: data.x_axis,
                    titleFontSize: 15,
                    format: 'HH:mm',
                    textStyle : {
                        fontSize: 10 // or the number you want
                    },
                    gridlines: {
                      count: -1,
                      units: {
                        days: {format: ['MMM dd']},
                        hours: {format: ['HH:mm', 'ha']},
                      }
                    },
                    minorGridlines: {
                      units: {
                        hours: {format: ['HH:mm', 'ha']},
                        minutes: {format: ['HH:mm', ':mm']}
                      }
                    }
                  },
                  vAxis: {
                    title: data.y_axis,
                    titleFontSize: 15,
                    textStyle : {
                        fontSize: 10 // or the number you want
                    }
                  },
                  series: {
                    1: { curveType: 'function' },
                  },
                  lineWidth: 5,
                  legend: {position: 'none'},
                  colors: data.color, 
                  title:data.title,
                  chartArea: {'width': '80%', 'height': '60%'},
                  titleFontSize: 20,
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
          <Button variant="contained" className={classes.button} onClick={this.updateData}>
              Reload
            </Button>
          <Button variant="contained" color="primary" className={classes.button} onClick={this.onFeedClick}>
              Feed
            </Button>
          <Button variant="contained" color="secondary" className={classes.button}>
              Breed
            </Button>
          <Grid container spacing={24}>
              {charts}
              
            </Grid>
            <Typography color="error">Warnings</Typography>
            <List >
              <ListItem>
                <Avatar className={classes.warning}>
                  <OpacityIcon />
                </Avatar>
                <ListItemText primary="Moisture Level too high" secondary="13:34 - 13:54 14.5.2019" />
              </ListItem>
              <ListItem>
                <Avatar className={classes.warning}>
                  <OpacityIcon />
                </Avatar>
                <ListItemText primary="Moisture Level too high" secondary="12:46 - 12:56 13.5.2019" />
              </ListItem>
              <ListItem>
                <Avatar className={classes.good}>
                  <PizzaIcon />
                </Avatar>
                <ListItemText primary="Larves can be harvested" secondary="16:35 12.5.2019" />
              </ListItem>
            </List>
          </Paper>
          
        </div>
        <Dialogs dialog_open={this.state.dialog_open}/>
      </div>
    );
  };
}

Container.propTypes = {
    classes: PropTypes.object.isRequired,
    cookies: PropTypes.instanceOf(Cookies).isRequired,
  };

export default withCookies(withStyles(styles)(Container));
