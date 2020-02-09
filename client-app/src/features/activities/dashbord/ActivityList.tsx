import React, { useContext } from 'react';
import { Item, Button, Label, Segment } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity';
import { observer } from 'mobx-react-lite';
import ActivityStore from "../../../app/stores/activityStore";

const ActivityList: React.FC = () => {
    const {activitiesByDate, selectActivity, deleteActivity, deletingActivityId, isDeleting } = useContext(ActivityStore);
    const generateContent = (activity: IActivity) => {
        return (
            <Item key={activity.id}>
                <Item.Content>
                    <Item.Header as='a'>{activity.title}</Item.Header>
                    <Item.Meta>{activity.date}</Item.Meta>
                    <Item.Description>
                        <div>{activity.description}</div>
                        <div>{activity.city}, {activity.venue}</div>
                    </Item.Description>
                    <Item.Extra>
                        <Button content='View' color='blue' floated='right' onClick={() => {
                            selectActivity(activity.id)
                        }}></Button>

                        <Button content='Delete' loading={deletingActivityId === activity.id && isDeleting} color='red' floated='right' onClick={() => {
                            deleteActivity(activity.id)
                        }}></Button>
                        <Label basic content='Category'></Label>
                    </Item.Extra>
                </Item.Content>
            </Item>
        );
    }

    return (
        <Segment clearing className="activity-list--dashboard">
            <Item.Group divided>
                {
                    activitiesByDate.map(generateContent)
                }
            </Item.Group>
        </Segment>
    )
}

export default observer(ActivityList);