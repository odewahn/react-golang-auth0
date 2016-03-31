import React from 'react'

import {connect} from 'react-redux'

import {Grid, Cell} from 'react-mdl';


const main = React.createClass({
  render: function() {
    return (
      <Grid>
        <Cell col={12}>
          <h1>Secured Page</h1>
          You have to be logged in to view this page!
        </Cell>
      </Grid>
    )
  }
});

//Map the local state directly to the state tree in the combined reducer.
export const SecuredPage = connect((state) => state)(main);
