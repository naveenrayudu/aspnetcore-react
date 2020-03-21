import React, { useContext} from 'react'
import { Form as FianlForm, Field } from 'react-final-form'
import { Form, Button, Header } from 'semantic-ui-react'
import TextInput from '../../app/common/form/TextInput'
import ErrorMessage from '../../app/common/form/ErrorMessage'
import RootStoreContext from '../../app/stores/rootStore'
import { IUserFormValues } from '../../app/models/user'
import { FORM_ERROR } from 'final-form'
import { combineValidators, isRequired } from 'revalidate'

const validators = combineValidators({
    username: isRequired('Username'),
    displayName: isRequired('Display Name'),
    email: isRequired('Email'),
    password: isRequired('Password')
})

const RegisterForm = () => {
    const { userStore: { register } } = useContext(RootStoreContext)
    
    return (
        <FianlForm validate={validators} onSubmit={(values: IUserFormValues) => register(values).catch(e => {
            return {
                [FORM_ERROR]: e
            }
        })}
            render={({ handleSubmit, form, submitting, submitError, dirtySinceLastSubmit, invalid, pristine }) => (
                <Form onSubmit={handleSubmit} error>
                    <Header as='h2' content='Login to Reactivities' color='teal' textAlign='center' />
                    <Field name='username' component={TextInput} placeholder='Username' autofocus />
                    <Field name='displayName' component={TextInput} placeholder='Display Name' />
                    <Field name='email' component={TextInput} placeholder='Email' />
                    <Field name='password' component={TextInput} placeholder='Password' type='password' />

                    {submitError && !dirtySinceLastSubmit && <ErrorMessage error={submitError} />}
                    <br />
                    <Button color='teal' disabled={(invalid && !dirtySinceLastSubmit) || pristine} loading={submitting} content='Login' fluid />
                </Form>
            )} />


    )
}

export default RegisterForm
