import React from 'react'

import {connect} from 'react-redux'

import {Grid, Cell} from 'react-mdl';


const main = React.createClass({
  render: function() {
    return (
      <Grid>
        <Cell style={{border: "1px solid blue", padding: "10px", borderRadius: "5px"}} col={12}>
          <h1>This page has profile info and requires a login</h1>
          Username: {this.props.User.get("Username")} <br/>
          Email: {this.props.User.get("Email")} <br/>
          API Key: {this.props.User.get("APIKey")} <br/>
        </Cell>
      </Grid>
    )
  }
});

//Map the local state directly to the state tree in the combined reducer.
export const UserDetails = connect((state) => state)(main);
