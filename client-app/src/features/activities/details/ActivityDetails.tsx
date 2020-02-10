import React, { useContext, useEffect } from 'react';
import { Card, Image, Button } from 'semantic-ui-react';
import ActivityStore from "../../../app/stores/activityStore";
import { observer } from 'mobx-react-lite';
import { useParams, useHistory } from 'react-router-dom';
import { IActivity } from '../../../app/models/activity';


const ActivityDetails: React.FC = () => {
    const { id = null } = useParams();
    const { activity, selectActivity } = useContext(ActivityStore);
    const history = useHistory();

    useEffect(() => {
        selectActivity(id)
    }, [id, selectActivity])


    const createActivityCard = (activity: IActivity) => {
        return (
            <Card fluid className='activity-details'>
                <Image src={`/assets/categoryImages/${activity.category}.jpg`} wrapped ui={false} />
                <Card.Content>
                    <Card.Header>{activity.title}</Card.Header>
                    <Card.Meta>
                        <span>{activity.date}</span>
                    </Card.Meta>
                    <Card.Description>
                        {activity.description}
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <Button.Group widths="2">
                        <Button basic content="Edit" color='blue' onClick={() => {
                            history.push(`/activities/edit/${id}`)
                        }} />
                        <Button basic content="Cancel" color='grey' onClick={() => {
                            selectActivity(null);
                            history.push('/activities');
                        }} />
                    </Button.Group>
                </Card.Content>
            </Card>
        )
    }

    if (activity === null)
        return null;

    return (
        <React.Fragment>
            <h1>Activity Details</h1>
            {
                activity != null ? createActivityCard(activity) : null
            }
        </React.Fragment>
    )
}

export default observer(ActivityDetails);