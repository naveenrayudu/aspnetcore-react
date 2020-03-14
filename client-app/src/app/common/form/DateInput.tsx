import React from 'react'
import { FieldRenderProps } from 'react-final-form'
import { FormFieldProps, Form, Label } from 'semantic-ui-react'
import {DateTimePicker} from 'react-widgets';

interface IProps extends FieldRenderProps<Date, HTMLElement>, FormFieldProps{
    id?: string | undefined
}

const DateInput: React.FC<IProps> = ({input, width, placeholder, date = false, time = false, meta: {touched, error}, ...rest}) => {
    return (
        <Form.Field error={touched && !!error} width={width}>
            <DateTimePicker 
                value={input.value || null} 
                onChange={(date) => input.onChange(date)}
                onBlur= {input.onBlur}
                onKeyDown={(e) => e.preventDefault()}
                placeholder={placeholder}
                date = {date}
                time = {time}
                {...rest}
            />
            {touched && error && (
                <Label basic color='red'>{error}</Label>
            )}
        </Form.Field>
    )
}

export default DateInput
