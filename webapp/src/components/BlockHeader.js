import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";


import Grid from '@material-ui/core/Grid';
import insectus from '../images/insectus_.png';
import Image from 'material-ui-image';

var styles = {
  marginBottom: "16px",
  marginTop: "16px",
  textTransform: "uppercase"
};

var image_style = {
  width: "100px",
  height: "41px",
  paddingTop: 0,
  backgroundColor: 0
}

class BlockHeader extends Component {
  render() {
    return (

      <Grid container spacing={16} alignItem={"center"}>
        
        <Grid item >
          <Image
            src={insectus} style={image_style}
          />
        </Grid>
        <Grid item >
          <Typography style={styles} variant="subtitle1">
            {" "}
            {this.props.name}{" "}
          </Typography>
        </Grid>
        
      </Grid>
      
    );
  }
}

export default BlockHeader;