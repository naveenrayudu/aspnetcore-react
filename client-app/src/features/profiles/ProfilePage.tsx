import React, { useContext, useEffect } from 'react'
import { Grid } from 'semantic-ui-react'
import ProfileHeader from './ProfileHeader'
import ProfileContent from './ProfileContent'
import RootStoreContext from '../../app/stores/rootStore'
import { useParams } from 'react-router-dom'
import LoadingComponent from '../../app/layout/LoadingComponent'
import { observer } from 'mobx-react-lite'

const ProfilePage = () => {
    const {profileStore: {loadingProfile, getUserProfile, 
                                    userProfile, isCurrentUser, uplaodPhoto, 
                                    uploadingPhoto, setMain, settingMainPhoto,
                                    deletePhoto, deleteingPhoto}} = useContext(RootStoreContext)
    const {username} = useParams();

    useEffect(() => {
        getUserProfile(username!)
    }, [username, getUserProfile])

    if(loadingProfile || !userProfile)
        return <LoadingComponent content='loading profile...'/>

    return (
        <Grid>
            <Grid.Column width={16}>
                <ProfileHeader profile={userProfile} />
            </Grid.Column>
            <Grid.Column width={16}>
                <ProfileContent profile={userProfile} isCurrentUser={isCurrentUser} uploadPhoto={uplaodPhoto} isUploading={uploadingPhoto} 
                        setMain={setMain} isSettingMain={settingMainPhoto} deletePhoto={deletePhoto} isDeletingPhoto={deleteingPhoto} />
            </Grid.Column>
        </Grid>
    )
}

export default observer(ProfilePage)
