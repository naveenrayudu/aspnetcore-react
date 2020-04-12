import React, { useContext, useEffect } from 'react';
import { Tab, Grid, Header, Card } from 'semantic-ui-react';
import RootStoreContext from '../../app/stores/rootStore';
import ProfileCard from './ProfileCard';
import { observer } from 'mobx-react-lite';
import LoadingComponent from '../../app/layout/LoadingComponent';
import { IProfile } from '../../app/models/profile';

const ProfileFollowings: React.FC<{
  predicate: string
}> = ({predicate}) => {
  const {profileStore: {userProfile, loadFollowings, followings, loadingFollowings}} = useContext(RootStoreContext);

  useEffect(() => {
    if(userProfile)
      loadFollowings(userProfile.userName, predicate);
  }, [userProfile, loadFollowings, predicate])

  if(loadingFollowings)
    return <LoadingComponent content={predicate === 'followers' ? 'Loading followers...' : 'Loading followings..'}/>

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header
            floated='left'
            icon='user'
            content={
              predicate === 'followers'
                ? `People following ${userProfile!.displayName}`
                : `People ${userProfile!.displayName} is following`
            }
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Card.Group itemsPerRow={5}>
            {
              followings && followings.length > 0 && followings.map((following: IProfile) =>  <ProfileCard key={following.userName} profile={following} />)
            }
          </Card.Group>
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default observer(ProfileFollowings);
