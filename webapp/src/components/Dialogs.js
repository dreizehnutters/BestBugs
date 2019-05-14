import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withCookies, Cookies } from 'react-cookie';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';

import * as StudioApi from "../services/client/ml-studio-api";

const foods = [
  {
    value: 'Bananas',
    label: 'Bananas',
  },
  {
    value: 'Apples',
    label: 'Apples',
  },
  {
    value: 'Peaches',
    label: 'Peaches',
  },
  {
    value: 'Waste',
    label: 'Waste',
  },
];

const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: theme.spacing.unit * 4,
  }
});

class Dialogs extends Component { 
  constructor(props) {
    super(props);

    const { cookies } = this.props;

    this.state = {
      open: this.props.dialog_open,
      food: foods[0].label,
      amount: 0,
      date: new Date('2014-08-18T21:11:54'),
    };

    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  

  handleClickOpen(){
    this.setState({ open: true });
  }

  handleClose(){
    this.setState({ open: false });
  }

  componentWillReceiveProps(props){

    if(props.dialog_open){
      this.handleClickOpen();
    }
    
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  onSubmit(){

    const data = {
      "food":this.state.food,
      "weight":this.state.amount,
      "time": this.state.date
    };

    StudioApi.sendFeeding(data);

    this.handleClose();
  }

  render(){

    const { classes } = this.props;

    return (
      <div>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">What do you feed?</DialogTitle>
          <DialogContent>
            <Grid container spacing={24}>
              <Grid item xs={6}>
                <TextField
                  id="food"
                  select
                  label="Select"
                  className={classes.textField}
                  value={this.state.food}
                  onChange={this.handleChange("food")}
                  SelectProps={{
                    MenuProps: {
                      className: classes.menu,
                    },
                  }}
                  helperText="Please select the kind of Food"
                  margin="normal"
                  variant="outlined"
                >
                {foods.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="number"
                  label="Weight in kg"
                  value={this.state.amount}
                  onChange={this.handleChange('amount')}
                  type="number"
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  id="datetime-local"
                  label="Timestamp"
                  type="datetime-local"
                  defaultValue="2019-05-13T10:30"
                  onChange={this.handleChange('date')}
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              
            </Grid>
            
            
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.onSubmit} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

Dialogs.propTypes = {
    classes: PropTypes.object.isRequired,
    cookies: PropTypes.instanceOf(Cookies).isRequired,
    dialog_open: PropTypes.bool
  };

export default withCookies(withStyles(styles)(Dialogs));
