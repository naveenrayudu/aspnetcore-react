import React from 'react'
import { FieldRenderProps } from 'react-final-form'
import { FormFieldProps, Form, Label } from 'semantic-ui-react'

interface IProps extends FieldRenderProps<string, HTMLElement>, FormFieldProps{}

const TextInput: React.FC<IProps> = ({input, width, placeholder, autofocus = false, meta: {touched, error}}) => {
    return (
        <Form.Field error={touched && !!error} width={width}>
            <input {...input} placeholder={placeholder} autoFocus = {autofocus} />
            {touched && error && (
                <Label basic color='red'>{error}</Label>
            )}
        </Form.Field>
    )
}

export default TextInput
