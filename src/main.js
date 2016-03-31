import React from 'react';
import ReactDOM from 'react-dom';

// Import react-router
import { Router, Route} from 'react-router'

// Import redux stuff
import {createStore, applyMiddleware} from 'redux';
import reducer from './state/index'
import thunk from 'redux-thunk'
import {Provider, connect} from 'react-redux';

// Import my app-specific pages
import {AppLayout} from './layout';
import {LoginPage} from './pageLogin'
import {UserDetails} from './pageUserDetails'
import {UnsecuredPage} from './pageUnsecured'
import {SecuredPage} from './pageSecured'
import NotFound from './components/not-found';


// create a store that has redux-thunk middleware enabled
//   https://github.com/gaearon/redux-thunk
//   https://github.com/rackt/redux/issues/291
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(reducer);

// Try to make a higher level component to handle authenticated requests
export function requireAuthentication(Component, LoginPage) {
  class AuthenticatedComponent extends React.Component {
    render() {
      return (
        <div>
            {this.props.User.toJS().IsLoggedIn === true
                ? <Component {...this.props}/>
                : <LoginPage {...this.props} />
            }
        </div>
      )
    }
  }
  return connect((state) => state)(AuthenticatedComponent)
}

// Define all the routes
const routes = (
    <Route component={AppLayout}>
      <Route name="unsecured" path="/unsecured" component={UnsecuredPage} />
      <Route name="secured" path="/secured" component={requireAuthentication(SecuredPage, LoginPage)} />
      <Route name="user_details" path="/user_details" component={requireAuthentication(UserDetails, LoginPage)} />
      <Route name="default" path="/" component={UnsecuredPage} />
      <Route path="*" component={NotFound} />
    </Route>
  )

ReactDOM.render(
  <Provider store={store}>
    <Router>{routes}</Router>
  </Provider>,
  document.getElementById('app'));
