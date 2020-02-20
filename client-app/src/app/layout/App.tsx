import React from "react";
import { Container } from 'semantic-ui-react';
import Navbar from "../../features/nav/Navbar";
import ActivityDashboard from "../../features/activities/dashbord/ActivityDashboard";
import { observer } from 'mobx-react-lite'
import { Route } from "react-router-dom";
import Home from "../../features/activities/home/Home";
import ActivityForm from "../../features/activities/forms/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";


const App = () => {
  
  return (
    <React.Fragment>
      <Route path='/' exact component={Home} />
      <Container style={{ marginTop: '6em' }}>
        <Route path='/(.+)' render={() => (
          <React.Fragment>
            <Navbar />
            <Route path='/activities' exact component={ActivityDashboard} />
            <Route path='/activities/:id' exact component={ActivityDetails} />
            <Route path='/activities/edit/:id' component={ActivityForm} />
            <Route path='/createActivity' component={ActivityForm} />
          </React.Fragment>
        )} />

      </Container>

    </React.Fragment>
  );

}

export default observer(App);
