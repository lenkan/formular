import * as React from 'react'
import { reduce, FormState, Action } from './store';
import { FormField, createField } from './field';
import { FormFieldArray, createFieldArray } from './field-array';

export interface FormComponentProps {
  form: {
    handleSubmit: (values: any) => void
    field: (key: string) => FormField
    array: (key: string) => FormFieldArray
  }
}

type FormProps = {
  defaultValue?: any,
  onSubmit?: (value: any) => any
}

export function form(FormComponent: React.ComponentClass<FormComponentProps> | React.StatelessComponent<FormComponentProps>): React.ComponentClass<FormProps> {
  class Form extends React.Component<FormProps, FormState> {
    constructor(props: FormProps) {
      super(props)
      this.state = {
        touched: {},
        values: {},
        refresh: false
      }

      this.handleSubmit = this.handleSubmit.bind(this)
      this.dispatch = this.dispatch.bind(this)
      this.field = this.field.bind(this)
      this.array = this.array.bind(this)
    }

    private dispatch(action: Action) {
      this.setState(prevState => reduce(prevState, action))
    }

    private handleSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault()
      this.props.onSubmit && this.props.onSubmit(this.state.values)
    }

    private field(field: string): FormField {
      return createField({
        field,
        state: {
          value: this.state.values[field],
          touched: this.state.touched[field]
        },
        dispatch: this.dispatch
      })
    }

    private array(field: string) {
      return createFieldArray({
        field,
        fields: Object.keys(this.state.values)
          .filter(key => key.startsWith(field))
          .map(key => ({
            key: key,
            value: this.state.values[key],
            touched: this.state.touched[key]
          })),
        dispatch: this.dispatch
      })
    }

    render() {
      return (
        <FormComponent form={{
          field: this.field,
          array: this.array,
          handleSubmit: this.handleSubmit
        }}
        />
      )
    }
  }

  return Form
}
