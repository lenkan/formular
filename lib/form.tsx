import * as React from 'react'
import reduce, { FormState, Action } from './reducer';
import { FormField, createField } from './field';


interface FormArray {
  enumerate<T>(cb: (args: { key: string, value: any, index: number, field: FormField }) => T): Array<T>
  push<T>(value: T): void
  remove(index: number): void
}

export interface FormComponentProps {
  handleSubmit: (values: any) => void
  field: (key: string) => FormField
  array: (key: string) => FormArray
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

    private array(field: string): FormArray {
      return {
        enumerate: cb => {
          return Object.keys(this.state.values)
            .filter(x => x.startsWith(field))
            .map((x, index) => cb({
              key: x,
              value: this.state.values[x],
              index,
              field: createField({
                field: x,
                state: {
                  value: this.state.values[x],
                  touched: this.state.touched[x]
                },
                dispatch: this.dispatch
              })
            }))
        },
        push: value => this.dispatch({
          type: 'FIELD_PUSH',
          value,
          field
        }),
        remove: index => this.dispatch({
          type: 'FIELD_REMOVE',
          field,
          index
        })
      }
    }


    render() {
      return (
        <FormComponent
          field={this.field}
          array={this.array}
          handleSubmit={this.handleSubmit}
        />
      )
    }
  }

  return Form
}
