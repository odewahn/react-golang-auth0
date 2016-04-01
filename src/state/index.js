/*********************************************************************
||  Import required modules
*********************************************************************/
import {combineReducers} from 'redux'
import {fromJS} from 'immutable'


import User from './user'
import Data from './api-data'


/*
The combineReducer function put all the reuders into a plain
old javascript object, so when you go to access it, you use regular
JS notation, not immutable.  The nodes, though, are still all immutable. See
this discussion on stackoverflow for a better explanation:

  -  http://stackoverflow.com/questions/32674767/redux-reducers-initializing-same-state-key
*/
export default combineReducers({
  User,
  Data
})
