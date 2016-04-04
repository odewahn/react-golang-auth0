/*********************************************************************
||  Import required modules
*********************************************************************/
import {fromJS, Map} from 'immutable'

/*********************************************************************
||  Define the state tree
*********************************************************************/
export const INITIAL_STATE = fromJS({
  IsLoggedIn: false,
  UserId: "",
  AccountType: "",
  AuthToken: "",
  Email: ""
})

/*********************************************************************
||  The reducer
*********************************************************************/
export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "setUserCredentials":
      return state.merge(action.credentials)
    case "logout":
      return state.set("IsLoggedIn", false)
  }
  return state;
}

/*********************************************************************
||  Allowed Actions
*********************************************************************/

// Handle Authentication for Autho0 per
//   https://auth0.com/blog/2016/01/04/secure-your-react-and-redux-app-with-jwt-authentication/
export function auth0Login() {
  const lock = new Auth0Lock('gcSxq9GfpUdVWNIvYiOsP7rh1s8u6ftA', 'odewahn.auth0.com');
  return dispatch => {

    lock.show((err, profile, token) => {
      if(err) {
        console.log("there was an error!")
        //dispatch(lockError(err))
        return
      }
      dispatch({
        type: "setUserCredentials",
        credentials: {
          IsLoggedIn: true,
          Email: profile.email,
          UserId: profile.user_id,
          AuthToken: token
        }
      })
      console.log("profile is", profile)
      console.log("token is", token)
      //localStorage.setItem('profile', JSON.stringify(profile))
      //localStorage.setItem('id_token', token)
      //dispatch(lockSuccess(profile, token))
    })
  }
}
