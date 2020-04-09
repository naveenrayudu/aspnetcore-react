import React, { useContext } from 'react';
import { Item, Label, Grid } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite';
import ActivityListItem from './ActivityListItem'
import { IActivity } from '../../../app/models/activity';
import RootStoreContext from '../../../app/stores/rootStore';
import {format} from 'date-fns';

const ActivityList: React.FC = () => {
    const { activityStore: { activitiesByDate } } = useContext(RootStoreContext);
    return (
        <React.Fragment>
            {activitiesByDate.map(([date, activities], index) => {
                return (
                    <Grid.Column key={date} style={{
                        marginTop: index > 1 ? '20px' : '0',
                        paddingTop: index > 1 ? '20px' : '0',
                        borderTop: index > 1 ? '1px solid black' : ''
                    }}>
                        <Label key={date} size='large' color='blue'>
                            {format(date, 'eeee do MMMM')}
                        </Label>

                        <Item.Group divided className="activity-list--dashboard">
                            {
                                activities.map((activity: IActivity) => <ActivityListItem key={activity.id} activity={activity} />)
                            }
                        </Item.Group>
                    </Grid.Column>
                )
            })
            }
        </React.Fragment>
    )
}

export default observer(ActivityList);