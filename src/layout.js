import React from 'react';
import {connect} from 'react-redux'
import {Layout, Header, Navigation, Icon, Content, Grid, Cell, Button} from 'react-mdl';
import {Link} from 'react-router'
import {auth0Login} from './state/user'

const main = React.createClass({
  logout: function() {
    this.props.dispatch({type: "logout"})
  },
  login: function() {
    this.props.dispatch(auth0Login())
  },
  render: function () {
    return (
     <Layout fixedHeader>
        <Header title="React+Redux Auth">
          <Navigation>
            <Link to="welcome" href=""><Icon style={{verticalAlign:'middle'}}  name="lock_open"/> Home</Link>
            <Link to="secured" href=""><Icon style={{verticalAlign:'middle'}}  name="lock"/> Data</Link>
          </Navigation>
          {this.props.User.toJS().IsLoggedIn === true
              ? <div>
                  <Link to="user_details" href="">{this.props.User.toJS().Email}</Link>
                  {'\u0020\u0020'}
                  <Button raised onClick={this.logout}>Sign Out</Button>
                </div>
              : <Button raised onClick={this.login}> Sign In</Button>
          }
        </Header>
        <Content className="mdl-color-text--grey-600">
          <Grid>
              {this.props.children}
         </Grid>
       </Content>
     </Layout>
    );
  }
});

//Map the local state directly to the state tree in the combined reducer.
export const AppLayout = connect((state) => state)(main);
