import React from 'react'

import {connect} from 'react-redux'

import {Grid, Cell} from 'react-mdl';

import {FetchDataForm} from './components/fetch-data'

const main = React.createClass({
  render: function() {
    let data = this.props.Data.get("Data").map(x => {
      return (
        <li>{x}</li>
      )
    })
    return (
      <Grid>
        <Cell col={12}>
          <h1>Secured Page</h1>
          You have to be logged in to view this page!
          <FetchDataForm {...this.props} />
          <h1>Your Data</h1>
          <ol>
            {data}
          </ol>
        </Cell>
      </Grid>
    )
  }
});

//Map the local state directly to the state tree in the combined reducer.
export const SecuredPage = connect((state) => state)(main);
