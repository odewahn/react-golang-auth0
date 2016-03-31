import React from 'react'

import {connect} from 'react-redux'

import {Grid, Cell} from 'react-mdl';


const main = React.createClass({
  render: function() {
    return (
        <Cell col={12}>
          <h1>User Profile</h1>
          This page should always require a login, and has all the info from the API:<br/>
          <b>Username</b>: {this.props.User.get("Username")} <br/>
          <b>Email</b>: {this.props.User.get("Email")} <br/>
          <b>API Key</b>: {this.props.User.get("APIKey")} <br/>
        </Cell>
    )
  }
});

//Map the local state directly to the state tree in the combined reducer.
export const UserDetails = connect((state) => state)(main);
