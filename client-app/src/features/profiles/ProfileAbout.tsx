import React, { useState } from 'react'
import { Tab, Grid, Header, Button, Form } from 'semantic-ui-react'
import { IProfile, IProfileFormValues } from '../../app/models/profile';
import { Form as FianlForm, Field } from 'react-final-form'
import { combineValidators, isRequired } from 'revalidate';
import TextInput from '../../app/common/form/TextInput';
import TextAreaInput from '../../app/common/form/TextAreaInput';
import ErrorMessage from '../../app/common/form/ErrorMessage';
import { FORM_ERROR } from 'final-form';

const profileValidators = combineValidators({
    displayName: isRequired('Display Name'),
    bio: isRequired('Bio')
})


interface IProps {
    isCurrentUser: boolean,
    profile: IProfile,
    updateProfile: (values: IProfileFormValues) => Promise<any>
}

const ProfileAbout: React.FC<IProps> = ({isCurrentUser, profile, updateProfile}) => {
    const [editAboutMode, setEditAboutMode] = useState(false);
    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column style={{paddingBottom: '0px'}} width={16}>
                    <Header floated='left' icon='image' content={`About ${profile.displayName}`} />
                    {
                        isCurrentUser && <Button floated='right' onClick={() => setEditAboutMode(!editAboutMode)} content={editAboutMode ? 'Cancel' : 'Edit Profile'} />
                    }
                </Grid.Column>
                <Grid.Column width={16}>
                    {
                        !editAboutMode ? (<div style={{whiteSpace: 'pre-line'}}>{profile.bio} </div>) : 
                        (
                            <FianlForm validate={profileValidators} initialValues={profile} onSubmit={(values: IProfileFormValues) => updateProfile(values).then(() => {
                                setEditAboutMode(false);
                            }).catch(e => {
                                return {
                                    [FORM_ERROR]: e
                                }
                            })} render={({handleSubmit, submitting, submitError, dirtySinceLastSubmit, invalid, pristine }) => (
                                
                                <Form onSubmit={handleSubmit} error>
                                    <Field name='displayName' value={profile.displayName} component={TextInput} placeholder='Display Name' />
                                    <Field name='bio' value={profile.bio} component={TextAreaInput} placeholder='Bio' />
                
                                    {submitError && !dirtySinceLastSubmit && <ErrorMessage error={submitError} />}
                                    <br />
                                    <Button color='teal' disabled={(invalid && !dirtySinceLastSubmit) || pristine} loading={submitting} content='Update' floated='right' />
                                </Form>
                            )} />
                        )
                    }
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
}

export default ProfileAbout
