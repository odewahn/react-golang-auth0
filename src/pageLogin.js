import React from 'react'

import {connect} from 'react-redux'

import {Grid, Cell} from 'react-mdl';

import {LoginForm} from './components/login'

const main = React.createClass({
  render: function() {
    return (
      <Grid>
        <Cell style={{border: "1px solid blue", padding: "10px", borderRadius: "5px"}} col={12}>
          <LoginForm {...this.props} />
        </Cell>
      </Grid>
    )
  }
});

//Map the local state directly to the state tree in the combined reducer.
export const LoginPage = connect((state) => state)(main);
