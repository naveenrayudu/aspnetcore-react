import React, { Fragment, useState, useEffect } from 'react';
import { Header, Grid, Button } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import PhotoWidgetDropZone from './PhotoWidgetDropZone';
import PhotoWidgetCropper from './PhotoWidgetCropper';

interface IProps {
    uploadPhoto: (photo: Blob) => void,
    isUploading: boolean
}

const PhotoUploadWidget: React.FC<IProps> = ({uploadPhoto, isUploading}) => {
    const [photos, setPhotos] = useState<any[]>([]);
    const [image, setImage] = useState<Blob|null>(null);

    useEffect(() => {
        return () => {
            photos.forEach(photo => URL.revokeObjectURL(photo.preview))
        }
    })

    return (<Fragment>
        <Grid>
            <Grid.Column width={4}>
                <Header color='teal' sub content='Step 1 - Add Photo' />
                <PhotoWidgetDropZone setPhotos={setPhotos} />
            </Grid.Column>
            <Grid.Column width={1} />
            <Grid.Column width={4}>
                <Header sub color='teal' content='Step 2 - Resize image' />
                {photos.length > 0 && <PhotoWidgetCropper setImage={setImage} imagePreview={photos[0].preview} /> }
            </Grid.Column>
            <Grid.Column width={1} />
            <Grid.Column width={4}>
                <Header sub color='teal' content='Step 3 - Preview & Upload' />
                {
                    photos.length > 0 && 
                    <Fragment>
                        <div className='img-preview' style={{minHeight: '200px', overflow: 'hidden'}}/>
                        <Button.Group widths={2}>
                            <Button positive icon='check' loading={isUploading} onClick={() => uploadPhoto(image!)}  />
                            <Button disabled={isUploading} icon='close' onClick={() => setPhotos([])} />
                        </Button.Group>
                    </Fragment>
                }
                
            </Grid.Column>
        </Grid>
    </Fragment>);

};

export default observer(PhotoUploadWidget);