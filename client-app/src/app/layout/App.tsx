import React, { useEffect, useContext } from "react";
import { Container } from 'semantic-ui-react';
import  Navbar from "../../features/nav/Navbar";
import ActivityDashboard from "../../features/activities/dashbord/ActivityDashboard";
import LoadingComponent from './LoadingComponent';
import ActivityStore from "../stores/activityStore";
import {observer} from 'mobx-react-lite'


const App = () => {
  const activityStore = useContext(ActivityStore);

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore])


  if (activityStore.loadingInitial)
    return <LoadingComponent content="Loading Activitites...." size='large' />

  return (
    <React.Fragment>
      <Navbar  />
      <Container style={{ marginTop: '6em' }}>
        <ActivityDashboard />
      </Container>
    </React.Fragment>
  );

}

export default observer(App);
