import React from 'react'
import { Card, Image, Button } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity'

interface IProps {
    activity: IActivity;
    setEditMode: (editMode: boolean) => void;
    selectActivity: (activity: IActivity | null) => void;
}

export const ActivityDetails: React.FC<IProps> = ({activity, setEditMode, selectActivity}) => {
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
                    <Button basic content="Edit" color='blue' onClick={() => setEditMode(true)}/>
                    <Button basic content="Cancel" color='grey' onClick={() => selectActivity(null)}/>
                </Button.Group>
            </Card.Content>
        </Card>
    )
}
