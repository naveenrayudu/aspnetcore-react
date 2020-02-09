import React, { useState, useEffect } from "react";
import { Container } from 'semantic-ui-react';
import { IActivity } from "../models/activity";
import { Navbar } from "../../features/nav/Navbar";
import ActivityDashboard from "../../features/activities/dashbord/ActivityDashboard";
import  LoadingComponent from './LoadingComponent';
import { v4 as uuid } from 'uuid';
import agent from "../api/agent";


const App = () => {

  const [activities, updateActivities] = useState<IActivity[]>([]);
  const [selectedActivity, selectActivity] = useState<IActivity | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [target, setTarget] = useState('');

  const setSelectedActivtiy = (id: string) => {
    selectActivity(activities.find(t => t.id === id) || null);
    setEditMode(false);
  }

  const openCreateForm = () => {
    selectActivity(null);
    setEditMode(true);
  }

  const saveNewActivity = (activity: IActivity) => {
    activity.id = uuid();
    setSubmitting(true);
    agent.Activities.create(activity).then(() => {
      updateActivities([activity, ...activities]);
      selectActivity(activity);
      setEditMode(false);
    }).then(() => setSubmitting(false));
  }

  const updateExistingActivity = (activity: IActivity) => {
    setSubmitting(true);
    agent.Activities.update(activity).then(() => {
      updateActivities([activity, ...activities.filter(t => t.id !== activity.id)]);
      selectActivity(activity);
      setEditMode(false);
    }).then(() => setSubmitting(false));
  }

  const deleteActivtiy = (id: string) => {
    setSubmitting(true);
    setTarget(id);
    agent.Activities.delete(id).then(() => {
      updateActivities(activities.filter(t => t.id !== id));
    }).then(() => {
      setSubmitting(false);
      setTarget('');
    });
  }

  useEffect(() => {
    agent.Activities.list()
      .then((data: IActivity[]) => {
        updateActivities(data.map(activity => {
          activity.date = (activity.date as any).split('.')[0];
          return activity;
        }))
      }).then(() => setLoading(false))
  }, [])


  if(loading)
    return <LoadingComponent content="Loading Activitites...." size='large' />

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
          deleteActivtiy={deleteActivtiy}
          submitting = {submitting}
          target = {target}
        />
      </Container>

    </React.Fragment>
  );

}

export default App;
