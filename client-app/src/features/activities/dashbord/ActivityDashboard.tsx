import React from 'react'
import { Grid } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';
import { ActivityList } from './ActivityList';
import { ActivityDetails } from '../details/ActivityDetails';
import { ActivityForm } from '../forms/ActivityForm';

interface IProps {
    activities: IActivity[];
    selectedActivity: IActivity | null;
    setSelectedActivtiy: (id: string) => void;
    editMode: boolean;
    setEditMode: (editMode: boolean) => void;
    selectActivity: (activity: IActivity | null) => void;
    saveNewActivity: (activity: IActivity) => void;
    updateExistingActivity: (activity: IActivity) => void;
    deleteActivtiy: (id: string) => void;
    submitting: boolean;
    target: string;
}

const ActivityDashboard: React.FC<IProps> = ({ activities, selectedActivity,
    setSelectedActivtiy, editMode,
    setEditMode, selectActivity,
    saveNewActivity, updateExistingActivity,
    deleteActivtiy, submitting, target }) => {
    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList activities={activities} setSelectedActivtiy={setSelectedActivtiy} deleteActivtiy={deleteActivtiy} submitting={submitting} target={target} />
            </Grid.Column>
            <Grid.Column width='6'>
                {selectedActivity && !editMode && <ActivityDetails activity={selectedActivity} setEditMode={setEditMode} selectActivity={selectActivity} />}

                {editMode && <ActivityForm key={(selectedActivity && selectedActivity.id) || 0}
                    setEditMode={setEditMode}
                    selectedActivity={selectedActivity}
                    saveNewActivity={saveNewActivity}
                    updateExistingActivity={updateExistingActivity}
                    submitting = {submitting} />}
            </Grid.Column>
        </Grid>
    )
}

export default ActivityDashboard;
