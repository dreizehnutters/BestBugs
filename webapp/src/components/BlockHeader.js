import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";


import Grid from '@material-ui/core/Grid';

var styles = {
  marginBottom: "16px",
  marginTop: "16px",
  textTransform: "uppercase"
};

class BlockHeader extends Component {
  render() {
    return (
      <div>
      <Typography style={styles} variant="subtitle1">
        {" "}
        {this.props.name}{" "}
      </Typography>

      </div>
    );
  }
}

export default BlockHeader;