import React from 'react';
import {connect} from 'react-redux'
import {Layout, Header, Navigation, Icon, Content, Grid, Cell} from 'react-mdl';
import {Link} from 'react-router'

const main = React.createClass({
  logout: function() {
    this.props.dispatch({type: "logout"})
  },
  render: function () {
    return (
     <Layout fixedHeader>
        <Header title="React+Redux Auth">
          <Navigation>
            <Link to="unsecured" href=""><Icon style={{verticalAlign:'middle'}}  name="lock_open"/> Home</Link>
            <Link to="secured" href=""><Icon style={{verticalAlign:'middle'}}  name="lock"/> Data</Link>
          </Navigation>
          {this.props.User.toJS().IsLoggedIn === true
              ? <div>
                  <Link to="user_details" href="">{this.props.User.toJS().Email}</Link>
                  {'\u0020\u0020'}
                  <Link to="" href="" onClick={this.logout}>logout</Link>
                </div>
              : <Link to="user_details" href="">login</Link>
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
