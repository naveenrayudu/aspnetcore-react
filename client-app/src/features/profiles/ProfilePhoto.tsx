import React, { useState } from 'react'
import { Tab, Header, Card, Image, Button, Grid } from 'semantic-ui-react'
import { IPhoto } from '../../app/models/profile'
import PhotoUpload from '../../app/common/photoUpload/PhotoUpload';

const ProfilePhoto: React.FC<{
    photos: IPhoto[],
    isCurrentUser: boolean,
    uploadPhoto: (file: Blob) => Promise<any>,
    isUploading: boolean,
    setMain: (id: string) => void,
    isSettingMain: boolean,
    deletePhoto: (id: string) => void,
    isDeletingPhoto: boolean
}> = ({ photos, isCurrentUser, uploadPhoto, isUploading, setMain, isSettingMain, deletePhoto, isDeletingPhoto}) => {

    const [addPhotoMode, setAddPhotoMode] = useState(false);
    const [mainPhotoId, settingMainPhotoId] = useState('');
    const [deletePhotoId, settingDeletePhotoId] = useState('');

    const photoUploadHandler = (file: Blob) => {
        uploadPhoto(file).then(() => setAddPhotoMode(false));
    }

    const setMainHandler = (id: string) => {
        settingMainPhotoId(id);
        setMain(id);
    }

    const deletePhotoHandler = (id: string) => {
        settingDeletePhotoId(id);
        deletePhoto(id)
    }

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column style={{paddingBottom: '0px'}} width={16}>
                    <Header floated='left' icon='image' content='Photos' />
                    {
                        isCurrentUser && <Button floated='right' onClick={() => setAddPhotoMode(!addPhotoMode)} content={addPhotoMode ? 'Cancel' : 'Add'} />
                    }
                </Grid.Column>
            
                <Grid.Column width={16}>
                    {
                        addPhotoMode ? (
                            <PhotoUpload uploadPhoto={photoUploadHandler} isUploading={isUploading} />
                        ) : (
                            <Card.Group itemsPerRow={5}>
                            {
                                photos.map(photo =>(
                                        <Card key={photo.id}>
                                            <Image fluid src={photo.url} />
                                            {
                                                isCurrentUser && (
                                                    <Button.Group fluid widths={2}>
                                                        <Button disabled={photo.isMain} positive content='Main' loading={photo.id === mainPhotoId && isSettingMain} basic onClick={() => setMainHandler(photo.id)}/>
                                                        <Button disabled={photo.isMain || (photo.id === mainPhotoId && isSettingMain)} loading={photo.id === deletePhotoId && isDeletingPhoto}  negative icon='trash' basic  onClick={() => deletePhotoHandler(photo.id)}/>
                                                    </Button.Group>
                                                )
                                            }
                                        </Card>
                                    ))
                            }
                        </Card.Group>
                        )
                    }
                   
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
}

export default ProfilePhoto
