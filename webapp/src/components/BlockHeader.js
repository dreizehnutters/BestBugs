import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import Image from 'material-ui-image';
import insectus from '../images/insectus.png';

var styles = {
  marginBottom: "16px",
  marginTop: "16px",
  textTransform: "uppercase"
};

var image = {
  width: "100px",
  height: "10px",
  paddingTop: 0
}

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