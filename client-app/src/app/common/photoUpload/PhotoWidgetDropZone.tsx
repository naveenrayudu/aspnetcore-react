import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import { Icon, Header } from 'semantic-ui-react'


const dropzoneStyle = {
    border: 'dashed 3px',
    borderColor: '#eee',
    borderRadius: '5px',
    paddingTop: '30%',
    textAlign: 'center' as 'center',
    height: '200px'
}

const dropzoneActiveStyle = {
    borderColor: 'green'
}

const PhotoWidgetDropZone: React.FC<{
    setPhotos: (files: object[]) => void
}> = ({setPhotos}) => {

  const onDrop = useCallback(acceptedFiles => {
    setPhotos(acceptedFiles.map((file: object) => Object.assign(file, {
        preview: URL.createObjectURL(file)
    })));
  }, [setPhotos])

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div {...getRootProps()} style={isDragActive ? {...dropzoneStyle, ...dropzoneActiveStyle} : dropzoneStyle}>
      <input {...getInputProps()} />
      <Icon name='upload' size='huge' />
      <Header content='Drag Images here' />
    </div>
  )
}

export default PhotoWidgetDropZone