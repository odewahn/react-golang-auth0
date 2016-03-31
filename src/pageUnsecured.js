import React from 'react'

import {connect} from 'react-redux'

import {Grid, Cell} from 'react-mdl';


const main = React.createClass({
  render: function() {
    return (
        <Cell col={12}>
          <h1>Welcome!</h1>
          This is an unsecured page that does not require a login.
          You might use this as a welcome page, help, etc.
        </Cell>
    )
  }
});

//Map the local state directly to the state tree in the combined reducer.
export const UnsecuredPage = connect((state) => state)(main);
