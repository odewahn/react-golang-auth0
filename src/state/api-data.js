/*********************************************************************
||  Import required modules
*********************************************************************/
import {fromJS, Map} from 'immutable'

/*********************************************************************
||  Define the state tree
*********************************************************************/
export const INITIAL_STATE = fromJS({
  Loading: false,
  N: "10",
  Data: []
})

const fetchDataURL = 'http://localhost:3000/data'

/*********************************************************************
||  The reducer
*********************************************************************/
export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "setDataFieldValue":
      return state.set(action.key, action.value)
    case "setData":
      return state.set("Data", action.data)
                  .set("Loading", false)
    case "setDataLoading":
      return state.set("Loading", true)
  }
  return state;
}

/*********************************************************************
||  Allowed Actions
*********************************************************************/

// Convert a structure into a query string
// http://stackoverflow.com/questions/1714786/querystring-encoding-of-a-javascript-object
function serialize(obj) {
  var str = [];
  for(var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
};

// Sets a field value
export function setDataFieldValue(key, value) {
  return({
    type: "setDataFieldValue",
    key: key,
    value: value
  })
}

// Deletes the container record at the given index
export function fetchData(key, n) {
  var request = {
    method: 'GET',
    headers: {
      "x-authentication": key
    }
  }
  return dispatch => {
    // Set the data loading flag
    dispatch({type: "setDataLoading"})
    // Perform the fetch
    fetch(fetchDataURL + "?" + serialize({N: n}), request)
      .then( response => response.json())
      .then( json => {
        dispatch({type:"setData", data: json})
      })
  }
}
