import React from 'react'
import {Tab} from 'semantic-ui-react'
import ProfilePhoto from './ProfilePhoto'
import { IProfile, IProfileFormValues } from '../../app/models/profile'
import ProfileAbout from './ProfileAbout'
import ProfileFollowings from './ProfileFollowings'

const style ={
    fontSize: '12px'
}

const ProfileContent: React.FC<{
    profile: IProfile,
    isCurrentUser: boolean,
    uploadPhoto: (file: Blob) => Promise<any>,
    isUploading: boolean,
    setMain: (id: string) => void,
    isSettingMain: boolean,
    deletePhoto: (id: string) => void,
    isDeletingPhoto: boolean,
    updateProfile: (values: IProfileFormValues) => Promise<any>
}> = ({profile, isCurrentUser, uploadPhoto, isUploading, setMain, isSettingMain, deletePhoto, isDeletingPhoto, updateProfile}) => {
    const panes = [
        { menuItem: 'About', render: () => <ProfileAbout isCurrentUser={isCurrentUser} profile={profile} updateProfile={updateProfile} /> },
        { menuItem: 'Photos', render: () => <ProfilePhoto photos={profile.photos} isCurrentUser={isCurrentUser}
                                                         uploadPhoto={uploadPhoto} isUploading={isUploading} setMain={setMain} isSettingMain={isSettingMain}
                                                          deletePhoto={deletePhoto} isDeletingPhoto={isDeletingPhoto} /> },
        { menuItem: 'Activities', render: () => <Tab.Pane style={style}>Activities Content</Tab.Pane> },
        { menuItem: 'Followers', render: () => <ProfileFollowings predicate='followers' /> },
        { menuItem: 'Following', render: () => <ProfileFollowings predicate='following' /> }
      ]

    return (
        <Tab className='profileClass' defaultActiveIndex={0} menu={{ fluid: true, vertical: true }} menuPosition='right' panes={panes} />
    )
}

export default ProfileContent
