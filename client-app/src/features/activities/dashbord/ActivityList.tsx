import React, { useContext } from 'react';
import { Item, Label } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite';
import ActivityListItem from './ActivityListItem'
import { IActivity } from '../../../app/models/activity';
import RootStoreContext from '../../../app/stores/rootStore';
import {format} from 'date-fns';

const ActivityList: React.FC = () => {
    const { activityStore: { activitiesByDate } } = useContext(RootStoreContext);
    return (
        <React.Fragment>
            {activitiesByDate.map(([date, activities]) => {
                return (
                    <React.Fragment key={date}>
                        <Label key={date} size='large' color='blue'>
                            {format(date, 'eeee do MMMM')}
                        </Label>

                        <Item.Group divided className="activity-list--dashboard">
                            {
                                activities.map((activity: IActivity) => <ActivityListItem key={activity.id} activity={activity} />)
                            }
                        </Item.Group>
                    </React.Fragment>
                )
            })
            }
        </React.Fragment>
    )
}

export default observer(ActivityList);