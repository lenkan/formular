import * as React from 'react'
import { ComponentType } from 'react'
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

export interface FormController {
  handleSubmit: (values: any) => void
  field: (key: string) => FormField
  array: (key: string) => FormFieldArray
}

export interface FormProps {
  defaultValue?: any,
  onSubmit?: (value: any) => any
}

export function form<TProps extends {} = {}>(
  FormComponent: ComponentType<TProps & { form: FormController }>
): React.ComponentClass<TProps & FormProps> {
  class Form extends React.Component<TProps & FormProps, FormState> {
    static displayName = `formular(${FormComponent.displayName || FormComponent.name})`;

    constructor(props: TProps & FormProps) {
      super(props)
      this.state = {
        touched: {},
        values: {}
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
      const controller: FormController = {
        field: this.field,
        array: this.array,
        handleSubmit: this.handleSubmit
      }

      return (
        <FormComponent form={controller} {...this.props} />
      )
    }
  }

  return Form
}
