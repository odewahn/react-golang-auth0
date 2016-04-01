import React from 'react'

import {connect} from 'react-redux'

import {Grid, Cell} from 'react-mdl';

import {LoginForm} from './components/login'

const main = React.createClass({
  render: function() {
    return (
      <div>
        <Cell col={12}>
          <LoginForm {...this.props} />
        </Cell>
      </div>
    )
  }
});

//Map the local state directly to the state tree in the combined reducer.
export const LoginPage = connect((state) => state)(main);
