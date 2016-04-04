import React from 'react';
import ReactDOM from 'react-dom';

// Import react-router
import { Router, Route, browserHistory} from 'react-router'

// Import redux stuff
import {createStore, applyMiddleware} from 'redux';
import reducer from './state/index'
import thunk from 'redux-thunk'
import {Provider, connect} from 'react-redux';

// Import my app-specific pages
import {AppLayout} from './layout';
import {UserDetails} from './pageUserDetails'
import {WelcomePage} from './pageWelcome'
import {SecuredPage} from './pageSecured'
import NotFound from './components/not-found';


// create a store that has redux-thunk middleware enabled
//   https://github.com/gaearon/redux-thunk
//   https://github.com/rackt/redux/issues/291
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(reducer);

// Try to make a higher level component to handle authenticated requests
export function requireAuthentication(Component, DefaultComponent) {
  class AuthenticatedComponent extends React.Component {
    render() {
      return (
        <div>
            {this.props.User.get("IsLoggedIn") === true
                ? <Component {...this.props}/>
              : <DefaultComponent {...this.props} />
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
      <Route name="welcome" path="/welcome" component={WelcomePage} />
      <Route name="secured" path="/secured" component={requireAuthentication(SecuredPage, WelcomePage)} />
      <Route name="user_details" path="/user_details" component={requireAuthentication(UserDetails, WelcomePage)} />
      <Route name="default" path="/" component={WelcomePage} />
      <Route path="*" component={NotFound} />
    </Route>
  )

ReactDOM.render(
  <Provider store={store}>
    <Router>{routes}</Router>
  </Provider>,
  document.getElementById('app'));
