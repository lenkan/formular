import * as React from 'react'
import reduce, { FormState, Action } from './reducer';

type ToggleInputType = 'radio' | 'checkbox'
type TextInputType = 'text' | 'password' | 'number' | 'email'

interface HTMLElementListener<T extends HTMLSelectElement | HTMLInputElement> {
  type?: ToggleInputType | TextInputType
  checked?: boolean
  id: string
  name: string
  value: string | string[] | number
  onChange: React.ChangeEventHandler<T>
  onBlur: React.FocusEventHandler<T>
}

interface InputOptions {
  type?: 'radio' | 'checkbox' | 'text' | 'password' | 'number' | 'email' | 'textarea' | 'select'
  exclusive?: boolean
  value?: string
}

interface FormField {
  /**
   * Current value of the field
   */
  readonly value: any

  /**
   * Specifies whether or not an input for this field has been touched
   */
  readonly touched: boolean

  /**
   * Changes the value of this field.
   */
  change(value: any)

  /**
   * Creates props to pass to an input element
   * @param options 
   */
  input<T extends HTMLInputElement | HTMLSelectElement>(options: InputOptions): HTMLElementListener<T>
}

interface FormArray {
  enumerate<T>(cb: (args: { key: string, value: any, index: number }) => T): Array<T>
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

function onChange<T extends HTMLInputElement | HTMLSelectElement>(handler: React.ChangeEventHandler<T>) {
  return e => handler(e)
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
      this.input = this.input.bind(this)
      this.array = this.array.bind(this)
    }

    private dispatch(action: Action) {
      this.setState(prevState => reduce(prevState, action))
    }

    private handleSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault()
      this.props.onSubmit && this.props.onSubmit(this.state.values)
    }

    private input<T extends HTMLInputElement | HTMLSelectElement>(field: string, options: InputOptions): HTMLElementListener<T> {
      const { type } = options
      switch (type) {
        case 'text':
        case 'password':
        case 'email':
          return {
            id: field,
            name: field,
            value: this.state.values[field] || '',
            type,
            onChange: onChange<HTMLInputElement>(event => this.dispatch({
              type: 'FIELD_CHANGE',
              field,
              value: event.target.value
            })),
            onBlur: () => this.dispatch({
              type: 'FIELD_BLUR',
              field
            })
          }
        case 'select':
          return {
            id: field,
            name: field,
            value: this.state.values[field] || '',
            onChange: onChange<HTMLSelectElement>(event => this.dispatch({
              type: 'FIELD_CHANGE',
              field,
              value: event.target.value
            })),
            onBlur: () => this.dispatch({
              type: 'FIELD_BLUR',
              field
            })
          }
        case 'checkbox':
        case 'radio':
          const { value } = options
          const key = options.exclusive ? `${field}.${value}` : field
          const checked = value !== undefined
            ? this.state.values[field] === value
            : !!this.state.values[field]
          return {
            type,
            name: key,
            id: key,
            checked,
            value,
            onChange: onChange<HTMLInputElement>(e => this.dispatch({
              type: 'FIELD_CHANGE',
              field,
              value: e.target.checked
                ? value !== undefined ? value : true
                : value !== undefined ? '' : false
            })),
            onBlur: () => this.dispatch({
              type: 'FIELD_BLUR',
              field
            })
          }
        default:
          return undefined
      }
    }


    private field(field: string): FormField {
      return {
        touched: this.state.touched[field] || false,
        value: this.state.values[field],
        change: (value) => {
          this.dispatch({
            type: 'FIELD_CHANGE',
            field,
            value
          })
        },
        input: options => this.input(field, options)
      }
    }

    private array(field: string): FormArray {
      return {
        enumerate: cb => {
          return Object.keys(this.state.values)
            .filter(x => x.startsWith(field))
            .map((x, index) => cb({ key: x, value: this.state.values[x], index }))
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
