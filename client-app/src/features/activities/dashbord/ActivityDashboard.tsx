import React, { useContext, useEffect } from 'react'
import { Grid } from 'semantic-ui-react';
import ActivityList from './ActivityList';
import { observer } from 'mobx-react-lite';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import RootStoreContext from '../../../app/stores/rootStore';


const ActivityDashboard: React.FC = () => {
    const {activityStore} = useContext(RootStoreContext);

    useEffect(() => {
      activityStore.loadActivities();
    }, [activityStore])
  
    if (activityStore.loadingInitial)
      return <LoadingComponent content="Loading Activitites...." size='large' />

    return (
        <Grid style={{
          paddingTop: '0px'
        }}>
            <Grid.Row columns={2}>
                <ActivityList />
            </Grid.Row>
        </Grid>
    )
}

export default observer(ActivityDashboard);
