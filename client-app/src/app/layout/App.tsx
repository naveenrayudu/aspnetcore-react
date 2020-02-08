import React, { useState, useEffect } from "react";
import { Container } from 'semantic-ui-react';
import axios from 'axios';
import { IActivity } from "../models/activity";
import { Navbar } from "../../features/nav/Navbar";
import ActivityDashboard from "../../features/activities/dashbord/ActivityDashboard";
import { v4 as uuid } from 'uuid';


const App = () => {

  const [activities, updateActivities] = useState<IActivity[]>([]);
  const [selectedActivity, selectActivity] = useState<IActivity | null>(null);
  const [editMode, setEditMode] = useState(false);

  const setSelectedActivtiy = (id: string) => {
    selectActivity(activities.find(t => t.id === id) || null);
    setEditMode(false);
  }

  const openCreateForm = () => {
    selectActivity(null);
    setEditMode(true);
  }

  const saveNewActivity = (activity: IActivity) => {
    activity.id = uuid()
    updateActivities([activity, ...activities]);
    selectActivity(activity);
    setEditMode(false);
  }

  const updateExistingActivity = (activity: IActivity) => {
    updateActivities([activity, ...activities.filter(t => t.id !== activity.id)]);
    selectActivity(activity);
    setEditMode(false);
  }

  const deleteActivtiy = (id: string) => {
    updateActivities(activities.filter(t => t.id !== id))
  }

  useEffect(() => {
    axios.get<IActivity[]>('http://localhost:5000/api/activities')
      .then((res) =>{
        updateActivities(res.data.map(activity => {
          activity.date = (activity.date as any).split('.')[0];
          return activity;
        }))
      } )
  }, [])

  return (
    <React.Fragment>
      <Navbar openCreateForm={openCreateForm} />
      <Container style={{ marginTop: '6em' }}>
        <ActivityDashboard activities={activities}
          selectedActivity={selectedActivity}
          setSelectedActivtiy={setSelectedActivtiy}
          editMode={editMode}
          setEditMode={setEditMode}
          selectActivity={selectActivity}
          saveNewActivity={saveNewActivity}
          updateExistingActivity={updateExistingActivity}
          deleteActivtiy = {deleteActivtiy}
        />
      </Container>

    </React.Fragment>
  );

}

export default App;
