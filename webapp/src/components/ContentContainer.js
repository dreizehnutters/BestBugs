import React, { Component } from "react";
import { Switch,Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { mapStateToProps } from "../reduxUtils";

//scenes
import Dashboard from "./Dashboard";
import Container from "./Container";

class ContentContainer extends Component {
  render() {
    return (
      <Switch>
        <Route path="/" exact render={()=> <Dashboard />} />
        <Route path="/dashboard" exact component={Dashboard} /> {/* render={()=> <Text_Classification />} /> */}
        <Route path="/container" exact component={Container} /> {/* render={()=> <Image_Classification />} /> */}
      </Switch>
    );
  }
}

export default connect(
  mapStateToProps
)(ContentContainer);
