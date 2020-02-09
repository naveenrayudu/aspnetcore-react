import React, { useState, useEffect, FormEvent, useContext } from 'react'
import { Segment, Form, Button } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity'
import ActivityStore from '../../../app/stores/activityStore'
import { observer } from 'mobx-react-lite'

const ActivityForm: React.FC = () => {
    const {setEditMode, selectedActivity, createActivity, isSubmitting, updateActivity} = useContext(ActivityStore);

    const initializeActivity = (activity: IActivity | null): IActivity => {
        if (activity !== null) {
            return activity;
        }

        return {
            id: '',
            title: '',
            description: '',
            category: '',
            city: '',
            venue: '',
            date: new Date()
        }
    }

    const [activity, updateActivityState] = useState<IActivity>(initializeActivity(selectedActivity));

    useEffect(() => {
        updateActivityState(initializeActivity(selectedActivity));
    }, [selectedActivity]);

    const onInputChange = (event: FormEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value } = event.currentTarget;
        updateActivityState({
            ...activity,
            [name]: value
        })
    }

    const saveActivity = () => {    
        activity.id === '' ? createActivity(activity) : updateActivity(activity);
    }

    return (
        <Segment clearing>
            <Form>
                <Form.Input onChange={onInputChange} name='title' placeholder='Title' value={activity.title} />
                <Form.TextArea rows={2} onChange={onInputChange} name='description' placeholder='Description' value={activity.description} />
                <Form.Input onChange={onInputChange} name='category' placeholder='Category' value={activity.category} />
                <Form.Input onChange={onInputChange} name='date' type='datetime-local' placeholder='Date' value={activity.date} />
                <Form.Input onChange={onInputChange} name='city' placeholder='City' value={activity.city} />
                <Form.Input onChange={onInputChange} name='venue' placeholder='Venue' value={activity.venue} />
                <Button floated='right' content='Submit' type='submit' loading={isSubmitting} positive onClick={saveActivity} />
                <Button floated='right' content='Cancel' type='button' onClick={() => setEditMode(false)} />
            </Form>
        </Segment>
    )
}

export default observer(ActivityForm);