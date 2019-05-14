import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Avatar from '@material-ui/core/Avatar';

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
import small_insect from '../images/small_insect.png';
import full_insect from '../images/full_insect.png';

const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: theme.spacing.unit * 4,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    margin: theme.spacing.unit * 2,
    //textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  center: {
    marginTop: theme.spacing.unit * 4,
    padding: theme.spacing.unit * 2
  },
  image: {
    width: 80,
    height: 80,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '70%',
    maxHeight: '70%',
  },
  button: {
    margin: theme.spacing.unit * 1,
  }
});

class Dashboard extends Component {
  constructor(props) {
    super(props);

    const { cookies } = this.props;

    this.state = {
      textFieldValue:"",
      widgetdata: Constants.WIDGET_ITEMS_DASHBOARD,
      container: [
        {
          "image":small_insect,
          "name": "Container 1",
          "moisture": "55",
          "temp": "34",
          "id": 463463

        },
        {
          "image":full_insect,
          "name": "Container 2",
          "moisture": "55",
          "temp": "35",
          "id": 464425

        },
        {
          "image":full_insect,
          "name": "Container 3",
          "moisture": "55",
          "temp": "28",
          "id": 46443225

        },
      ]
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
      let container = this.state.container;

      container[0].moisture = stats.current_moisture;
      container[1].moisture = stats.current_temp;

      this.setState({
        container: container
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

    const listContainers = this.state.container.map((data) =>
                <Grid item xs>
                <Paper key={data.name} className={classes.paper}>
                <Grid container spacing={24}>
                  <Grid item>
                    <Avatar className={classes.image}>
                      <img className={classes.img} alt="complex" src={data.image} />
                    </Avatar>
                  </Grid>
                  <Grid item xs={12} sm container>
                    <Grid item xs container direction="column" spacing={16}>
                      <Grid item xs>
                        <Typography gutterBottom variant="subtitle1">
                          {data.name}
                        </Typography>
                        <Typography gutterBottom>Current Moisture: {data.moisture}</Typography>
                        <Typography gutterBottom>Current Temperature: {data.temp}</Typography>
                        <Typography color="textSecondary">ID: {data.id}</Typography>
                      </Grid>
                      <Grid item>
                        <Button variant="contained" color="primary" className={classes.button}>
                          Feed
                        </Button>
                        <Button variant="contained" color="secondary" className={classes.button}>
                          Breed
                        </Button>
                      </Grid>
                    </Grid>
                    <Grid item>
                    </Grid>
                  </Grid>
                </Grid>
                </Paper>
                </Grid>
    );

    return (
      <div>

        <div className={classes.root}>
          <BlockHeader name="Dashboard" />
          <Paper className={classes.center}>
            <Grid container spacing={24}>
                {listContainers}
             
            </Grid>
          </Paper>
          <Button component="span" variant="outlined" className={classes.button}>
              Add Container
            </Button>
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
