import React, { useState, useEffect, useContext } from 'react'
import { Segment, Form, Button, Grid } from 'semantic-ui-react'
import { ActivityFormValues } from '../../../app/models/activity'
import { observer } from 'mobx-react-lite'
import { useHistory, useParams } from 'react-router-dom'
import { Form as FinalForm, Field } from 'react-final-form'
import TextInput from '../../../app/common/form/TextInput'
import TextAreaInput from '../../../app/common/form/TextAreaInput'
import SelectInput from '../../../app/common/form/SelectInput'
import { category } from '../../../app/common/options/categoryOptions'
import DateInput from '../../../app/common/form/DateInput'
import { combineDateTime } from '../../../app/common/util/util'
import {combineValidators, isRequired, composeValidators, hasLengthGreaterThan} from 'revalidate'
import RootStoreContext from '../../../app/stores/rootStore'


const validate = combineValidators({
    title: isRequired({message: 'The event title is required.'}),
    category: isRequired('Category'),
    city: isRequired('City'),
    venue: isRequired('Venue'),
    date: isRequired('Date'),
    time: isRequired('Time'),
    description: composeValidators(
            isRequired('Description'), 
            hasLengthGreaterThan(4)({message: 'Description needs to be at least 5 characters'})
        )()
})

const ActivityForm: React.FC = () => {
    const { activityStore: { loadActivityDetails, createActivity, isSubmitting, updateActivity, clearActivity }} = useContext(RootStoreContext);
    const history = useHistory();
    const { id = '' } = useParams();

    const [activity, updateActivityState] = useState(new ActivityFormValues());
    const [loading, updateLoadingState] = useState<boolean>(false);
    useEffect(() => {
        if (id !== '') {
            updateLoadingState(true);
            loadActivityDetails(id).then(activity => {
                updateActivityState(new ActivityFormValues(activity));
                updateLoadingState(false);
            });
        }
        else {
            clearActivity();
        }
    }, [id, clearActivity, loadActivityDetails])

    // const onInputChange = (event: FormEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    //     const { name, value } = event.currentTarget;
    //     updateActivityState({
    //         ...activity,
    //         [name]: value
    //     })
    // }


    const finalFormSubmit = (values: any) => {
        const dateTime = combineDateTime(values.date, values.time);
        const { date, time, ...activity } = values;
        activity.date = dateTime;

        return !activity.id ? createActivity(activity).then(() =>  history.push(`/activities/${activity.id}`)).catch(() => {}) 
                            :  updateActivity(activity).then(() => history.push(`/activities/${activity.id}`)).catch(() => {});
    };

    return (
        <Grid>
            <Grid.Column width={10}>
                <Segment clearing>

                    <FinalForm validate={validate} initialValues={activity} onSubmit={finalFormSubmit} render={({ handleSubmit, invalid, pristine }) => {
                        return (
                            <Form onSubmit={handleSubmit} loading={loading}>
                                <Field name='title' placeholder='Title' value={activity.title} component={TextInput} />
                                <Field name='description' rows={3} placeholder='Description' value={activity.description} component={TextAreaInput} />
                                <Field name='category' placeholder='Category' value={activity.category} component={SelectInput} options={category} />
                                <Form.Group widths='equal'>
                                    <Field name='date' min={new Date()} placeholder='Date' date={true} value={activity.date} component={DateInput} />
                                    <Field name='time' placeholder='Time' time={true} value={activity.time} component={DateInput} />
                                </Form.Group>

                                <Field name='city' placeholder='City' value={activity.city} component={TextInput} />
                                <Field name='venue' placeholder='Venue' value={activity.venue} component={TextInput} />
                                <Button floated='right' content='Submit' type='submit' disabled={loading || invalid || pristine } loading={isSubmitting} positive />
                                <Button floated='right' content='Cancel' type='button' disabled={loading} onClick={() => {
                                  activity.id ? history.push(`/activities/${activity.id}`): history.push('/activities');
                                }} />
                            </Form>
                        )
                    }} />


                </Segment>
            </Grid.Column>
        </Grid>

    )
}

export default observer(ActivityForm);