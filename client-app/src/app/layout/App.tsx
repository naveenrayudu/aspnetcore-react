import React, { useEffect, useContext } from "react";
import { Container } from 'semantic-ui-react';
import Navbar from "../../features/nav/Navbar";
import ActivityDashboard from "../../features/activities/dashbord/ActivityDashboard";
import { observer } from 'mobx-react-lite'
import { Route, Switch } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import Home from "../../features/home/Home";
import ActivityForm from "../../features/activities/forms/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import NotFound from './NotFound';
import ModalContainer from "../common/modals/ModalContainer";
import RootStoreContext from "../stores/rootStore";


const App = () => {

  const { userStore: { user, getUser }, commonStore: {token, setAppLoaded} } = useContext(RootStoreContext);
   useEffect(() => {
        if(token && !user) {
            getUser().finally(() => {
                setAppLoaded();
            })
        }
        else {
            setAppLoaded();
        }}, [token, setAppLoaded, getUser, user]
      )

  return (
    <React.Fragment>
      <Route path='/' exact component={Home} />
      <Container style={{ marginTop: '6em' }}>
        <Route path='/(.+)' render={() => (
          <React.Fragment>
            <Navbar />
            <Switch>
              <Route path='/activities' exact component={ActivityDashboard} />
              <Route path='/activities/:id' exact component={ActivityDetails} />
              <Route path='/activities/edit/:id' component={ActivityForm} />
              <Route path='/createActivity' component={ActivityForm} />
              <Route component={NotFound} />
            </Switch>

          </React.Fragment>
        )} />

      </Container>
      <ModalContainer />
      <ToastContainer position='bottom-right'/>
    </React.Fragment>
  );

}

export default observer(App);
