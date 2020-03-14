import React from "react";
import { Item, Button, Segment, Icon } from "semantic-ui-react";
import { Link } from 'react-router-dom';
import { IActivity } from "../../../app/models/activity";
import {format} from 'date-fns'

const ActivityListItem: React.FC<{
    activity: IActivity;
}> = ({ activity }) => {
    return (
        <Segment.Group>
            <Segment>
                <Item.Group>
                    <Item key={activity.id}>
                        <Item.Image size='tiny' circular src='/assets/user.png' />
                        <Item.Content>
                            <Item.Header as="a">{activity.title}</Item.Header>

                            <Item.Description>
                                Hosted by Bob.
                            </Item.Description>
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <Icon name='clock' /> {format(activity.date, 'h:mm a')}
                <Icon name='marker' /> {activity.venue}, {activity.city}
            </Segment>
            <Segment secondary>
                Attendess will go here.
            </Segment>
            <Segment clearing>
                <span>{activity.description}</span>
                <Button
                    content="View"
                    color="blue"
                    floated="right"
                    as={Link}
                    to={`/activities/${activity.id}`}
                ></Button>
            </Segment>
        </Segment.Group>


    );
};

export default ActivityListItem;
