/*********************************************************************
||  Import required modules
*********************************************************************/
import {fromJS, Map} from 'immutable'

/*********************************************************************
||  Define the state tree
*********************************************************************/
export const INITIAL_STATE = fromJS({
  Username: "",
  Password: "",
  IsLoggedIn: false,
  Token: "",
  AccountType: "",
  Email: ""
})

const fetchProjectMetadataURL = 'http://localhost:3000/project'

/*********************************************************************
||  The reducer
*********************************************************************/
export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "setUserFieldValue":
      return state.set(action.key, action.value)
    case "setUserCredentials":
      return state.merge(action.credentials)
  }
  return state;
}

/*********************************************************************
||  Allowed Actions
*********************************************************************/

// Sets a field value
export function setUserFieldValue(key, value) {
  return({
    type: "setUserFieldValue",
    key: key,
    value: value
  })
}

// Deletes the container record at the given index
export function login(creds) {
  console.log(creds)
  var request = {
    method: 'POST',
    body: JSON.stringify(creds),
    headers: {
      "x-authentication": "my little friend"
    }
  }
  return dispatch => {
    fetch("http://localhost:3000/login", request)
      .then( response => response.json())
      .then( json => {
        console.log("data is posted", json)
        dispatch({type:"setUserCredentials", credentials: json})
      })
  }
}
