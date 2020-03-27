import React from "react";
import { Item, Button, Segment, Icon, Label } from "semantic-ui-react";
import { Link } from 'react-router-dom';
import { IActivity } from "../../../app/models/activity";
import {format} from 'date-fns'
import ActivityListeItemAttendees from "./ActivityListeItemAttendees";

const ActivityListItem: React.FC<{
    activity: IActivity;
}> = ({ activity }) => {
    const host = activity.attendees.find(t => t.isHost)
    return (
        <Segment.Group>
            <Segment>
                <Item.Group>
                    <Item key={activity.id}>
                        <Item.Image size='tiny' circular src={host?.image || '/assets/user.png'} />
                        <Item.Content>
                            <Item.Header as={Link} to={`/activities/${activity.id}`}>{activity.title}</Item.Header>

                            <Item.Description>
                                Hosted by {host?.displayName}.
                            </Item.Description>
                            {
                                activity.isHost && 
                                <Item.Description>
                                    <Label basic color='orange' content='You are hosting this activity' />
                                </Item.Description>
                            }

                            {
                                activity.isGoing && !activity.isHost && 
                                <Item.Description>
                                    <Label basic color='green' content='You are going to this activity' />
                                </Item.Description>
                            }
                            
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <Icon name='clock' /> {format(activity.date, 'h:mm a')}
                <Icon name='marker' /> {activity.venue}, {activity.city}
            </Segment>
            <Segment secondary>
                <ActivityListeItemAttendees attendees={activity.attendees} />
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
