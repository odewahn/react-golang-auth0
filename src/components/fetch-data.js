import React from 'react';
import {Textfield, Button, Spinner} from 'react-mdl';
import {setDataFieldValue, fetchData} from '../state/api-data'

export const FetchDataForm = React.createClass({
  handleClick: function() {
    console.log("they want", this.props.Data.get("N"), "items")
    this.props.dispatch(fetchData(this.props.User.get("AuthToken"), this.props.Data.get("N")))
  },
  setField: function(e) {
    this.props.dispatch(setDataFieldValue(e.target.name, e.target.value))
  },
  render: function() {
    return (
      <div>
        <Textfield
          label="# of data points"
          floatingLabel
          name="N"
          onChange={this.setField}
          value={this.props.Data.get("N")}/>
        <Button onClick={this.handleClick} colored raised>
          Fetch
          {this.props.Data.toJS().Loading === true ? <Spinner /> : null }
        </Button>
      </div>
    )
  }
})
