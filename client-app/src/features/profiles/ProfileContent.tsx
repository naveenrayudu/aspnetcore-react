import React from 'react'
import {Tab} from 'semantic-ui-react'
import ProfilePhoto from './ProfilePhoto'
import { IProfile } from '../../app/models/profile'

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
    isDeletingPhoto: boolean
}> = ({profile, isCurrentUser, uploadPhoto, isUploading, setMain, isSettingMain, deletePhoto, isDeletingPhoto}) => {
    const panes = [
        { menuItem: 'About', render: () => <Tab.Pane style={style}>About Content</Tab.Pane> },
        { menuItem: 'Photos', render: () => <ProfilePhoto photos={profile.photos} isCurrentUser={isCurrentUser}
                                                         uploadPhoto={uploadPhoto} isUploading={isUploading} setMain={setMain} isSettingMain={isSettingMain}
                                                          deletePhoto={deletePhoto} isDeletingPhoto={isDeletingPhoto} /> },
        { menuItem: 'Activities', render: () => <Tab.Pane style={style}>Activities Content</Tab.Pane> },
        { menuItem: 'Followers', render: () => <Tab.Pane style={style}>Followers Content</Tab.Pane> },
        { menuItem: 'Following', render: () => <Tab.Pane style={style}>Following Content</Tab.Pane> }
      ]

    return (
        <Tab className='profileClass' defaultActiveIndex={1} menu={{ fluid: true, vertical: true }} menuPosition='right' panes={panes} />
    )
}

export default ProfileContent
