import React from 'react';
import {connect} from 'react-redux'
import {Layout, Header, Navigation, Icon, Content, Grid, Cell} from 'react-mdl';
import {Link} from 'react-router'

const main = React.createClass({
  render: function () {
    return (
     <Layout fixedHeader>
        <Header title="My App">
          <Navigation>
            <Link to="login" href=""><Icon style={{verticalAlign:'middle'}}  name="settings"/> Login</Link>
            <Link to="user_details" href=""><Icon style={{verticalAlign:'middle'}}  name="settings"/> User Details</Link>
          </Navigation>
          {this.props.User.get("Email")}
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
