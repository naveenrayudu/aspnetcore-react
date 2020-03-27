import React, { useContext, useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import ActivityDetailedHeader from './ActivityDetailedHeader';
import ActivityDetailedChat from './ActivityDetailedChat';
import ActivityDetailedInfo from './ActivityDetailedInfo';
import ActivityDetailedSidebar from './ActivityDetailedSidebar';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import RootStoreContext from '../../../app/stores/rootStore';


const ActivityDetails: React.FC = () => {
    const { id = null } = useParams();
    const { activityStore: { activity, loadActivityDetails, loadingInitial }}= useContext(RootStoreContext);

    useEffect(() => {
        loadActivityDetails(id)
    }, [id, loadActivityDetails])

    if (loadingInitial)
        return  <LoadingComponent content="Loading Activity...." size='large' />;

    if(activity === null)
        return <h2>No Activity Found</h2>

    return (
        <Grid columns={2}>
            <Grid.Row>
                <Grid.Column width={11}>
                    <ActivityDetailedHeader activity={activity} />
                    <ActivityDetailedInfo activity={activity} />
                    <ActivityDetailedChat />
                </Grid.Column>
                <Grid.Column width={4}>
                    <ActivityDetailedSidebar attendees={activity.attendees} />
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}

export default observer(ActivityDetails);