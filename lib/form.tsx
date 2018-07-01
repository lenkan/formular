import * as React from 'react'
import reduce, { FormState, Action } from './reducer';

type ToggleInputType = 'radio' | 'checkbox'
type TextInputType = 'text' | 'password' | 'number' | 'email'

type InputProps = {
  type: ToggleInputType | TextInputType
  onChange: React.ChangeEventHandler<HTMLInputElement>
  onBlur: React.FocusEventHandler<HTMLInputElement>
  checked?: boolean
  id: string
  name: string
  value: string | string[] | number
}

type SelectProps = {
  onChange: React.ChangeEventHandler<HTMLSelectElement>
  onBlur: React.FocusEventHandler<HTMLSelectElement>
  id: string
  name: string
  value: string | string[] | number
}

type TextareaProps = {
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>
  onBlur: React.FocusEventHandler<HTMLTextAreaElement>
  id: string
  name: string
  value: string
}

type CustomProps<T> = {
  value: T,
  onChange: (value: T) => void,
  onBlur: () => void
}

type ToggleOptions = {
  /**
   * Specifies wether this checkbox should exclusively
   * set the specified field value
   */
  exclusive?: boolean
}


type SelectInputHandler = (key: string) => SelectProps
type TextInputHandler = (key: string) => InputProps
type ToggleInputHandler = (key: string, value?: string, options?: ToggleOptions) => InputProps

type FormInput =
  { [T in TextInputType]: TextInputHandler } &
  { [T in ToggleInputType]: ToggleInputHandler } &
  { select: SelectInputHandler }

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
}

interface FormArray {
  enumerate<T>(cb: (args: { key: string, value: any, index: number }) => T): Array<T>
  push<T>(value: T): void
  remove(index: number): void
}

export interface FormComponentProps {
  handleSubmit: (values: any) => void
  input: FormInput
  field: (key: string) => FormField
  array: (key: string) => FormArray
}

type FormProps = {
  defaultValue?: any,
  onSubmit?: (value: any) => any
}

function onChange<T extends HTMLInputElement | HTMLSelectElement>(handler: (value: string) => void) {
  return (event: React.ChangeEvent<T>) => {
    handler(event.target.value)
  }
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
      this.selectInput = this.selectInput.bind(this)
      this.toggleInput = this.toggleInput.bind(this)
      this.textInput = this.textInput.bind(this)
    }

    private dispatch(action: Action) {
      this.setState(prevState => reduce(prevState, action))
    }

    private handleSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault()
      this.props.onSubmit && this.props.onSubmit(this.state.values)
    }

    private field(field: string): FormField {
      return {
        touched: this.state.touched[field] || false,
        value: this.state.values[field],
        change: value => this.dispatch({
          type: 'FIELD_CHANGE',
          field,
          value
        })
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

    private selectInput(field): SelectProps {
      return {
        value: this.state.values[field] || '',
        onChange: onChange(value => this.dispatch({
          type: 'FIELD_CHANGE',
          field,
          value
        })),
        onBlur: () => this.dispatch({ type: 'FIELD_BLUR', field }),
        name: field,
        id: field
      }
    }

    private textInput(type: TextInputType): TextInputHandler {
      return field => ({
        type,
        value: this.state.values[field] || '',
        onChange: onChange(value => this.dispatch({
          type: 'FIELD_CHANGE',
          field,
          value
        })),
        onBlur: () => this.dispatch({
          type: 'FIELD_BLUR',
          field
        }),
        name: field,
        id: field
      })
    }

    private toggleInput(type: ToggleInputType): ToggleInputHandler {
      return (field, value, options = { exclusive: false }) => {
        const key = options.exclusive ? `${field}.${value}` : field
        const checked = value !== undefined
          ? this.state.values[field] === value
          : !!this.state.values[field]

        const checkedValue = value !== undefined ? value : true
        const unCheckedValue = value !== undefined ? value : true

        return {
          type,
          name: key,
          id: key,
          checked,
          value,
          onChange: (e) => this.dispatch({
            type: 'FIELD_CHANGE',
            field,
            value: e.target.checked
              ? value !== undefined ? value : true
              : value !== undefined ? '' : false
          }),
          onBlur: () => this.dispatch({
            type: 'FIELD_BLUR',
            field
          })
        }
      }
    }

    render() {
      return (
        <FormComponent
          field={this.field}
          input={{
            select: this.selectInput,
            text: this.textInput('text'),
            password: this.textInput('password'),
            number: this.textInput('number'),
            email: this.textInput('email'),
            checkbox: this.toggleInput('checkbox'),
            radio: this.toggleInput('radio')
          }}
          array={this.array}
          handleSubmit={this.handleSubmit}
        />
      )
    }
  }

  return Form
}
