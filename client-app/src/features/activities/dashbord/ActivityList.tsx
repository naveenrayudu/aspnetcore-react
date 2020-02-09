import React from 'react';
import { Item, Button, Label, Segment } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity';

interface IProps {
    activities: IActivity[];
    setSelectedActivtiy: (id: string) => void;
    deleteActivtiy: (id: string) => void;
    submitting: boolean;
    target: string
}

export const ActivityList: React.FC<IProps> = ({ activities, setSelectedActivtiy, deleteActivtiy, submitting, target }) => {

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
                            setSelectedActivtiy(activity.id)
                        }}></Button>

                        <Button content='Delete' loading={target === activity.id && submitting} color='red' floated='right' onClick={() => {
                            deleteActivtiy(activity.id)
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
                    activities.map(generateContent)
                }
            </Item.Group>
        </Segment>
    )
}
