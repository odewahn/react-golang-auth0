import React from 'react';
import ReactDOM from 'react-dom';

// Import react-router
import { Router, Route} from 'react-router'

// Import redux stuff
import {createStore, applyMiddleware} from 'redux';
import reducer from './state/index'
import thunk from 'redux-thunk'
import {Provider} from 'react-redux';


// Import my app-specific pages
import {AppLayout} from './layout';
import {LoginPage} from './pageLogin'
import {UserDetails} from './pageUserDetails'
import NotFound from './components/not-found';


// create a store that has redux-thunk middleware enabled
// * https://github.com/gaearon/redux-thunk
// * https://github.com/rackt/redux/issues/291
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(reducer);

function requireAuth(nextState, replace) {
  console.log(nextState)
  if (true) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

// Define all the routes
const routes = (
  <Route component={AppLayout}>
    <Route name="login" path="/login" component={LoginPage} />
    <Route name="user_details" path="/user_details" component={UserDetails} onEnter={requireAuth}/>
    <Route name="default" path="/" component={LoginPage} />
    <Route path="*" component={NotFound} />
  </Route>
);


ReactDOM.render(
  <Provider store={store}>
    <Router>{routes}</Router>
  </Provider>,
  document.getElementById('app'));
