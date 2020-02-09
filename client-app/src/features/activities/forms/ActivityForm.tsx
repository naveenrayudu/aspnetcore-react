import React, { useState, useEffect, FormEvent } from 'react'
import { Segment, Form, Button } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity'

interface IProps {
    setEditMode: (editMode: boolean) => void;
    selectedActivity: IActivity | null;
    saveNewActivity: (activity: IActivity) => void;
    updateExistingActivity: (activity: IActivity) => void;
    submitting: boolean
}

export const ActivityForm: React.FC<IProps> = ({ setEditMode, selectedActivity, saveNewActivity, updateExistingActivity, submitting }) => {

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

    const [activity, updateActivity] = useState<IActivity>(initializeActivity(selectedActivity));

    useEffect(() => {
        updateActivity(initializeActivity(selectedActivity));
    }, [selectedActivity]);

    const onInputChange = (event: FormEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value } = event.currentTarget;
        updateActivity({
            ...activity,
            [name]: value
        })
    }

    const saveActivity = () => {    
        activity.id === '' ? saveNewActivity(activity) : updateExistingActivity(activity);
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
                <Button floated='right' content='Submit' type='submit' loading={submitting} positive onClick={saveActivity} />
                <Button floated='right' content='Cancel' type='button' onClick={() => setEditMode(false)} />
            </Form>
        </Segment>
    )
}
