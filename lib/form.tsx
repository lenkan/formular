import * as React from 'react'
import reduce, { FormState, Action } from './reducer';

type FieldMeta = {
  touched: boolean
}

interface InputListener {
  select: (key: string) => React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>
  text: (key: string) => React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
  selection: (key: string, value?: string) => React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
  toggle: (key: string) => React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
}

export interface FormComponentProps {
  handleSubmit: (values: any) => void
  input: InputListener
  meta: (key: string) => FieldMeta
  value: (key: string) => any
  enumerate<T>(key: string, cb: (args: { key: string, value: any }) => T): Array<T>
  push<T>(key: string, value: T): void
  change<T>(key: string, value: T): void
  refresh: boolean
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

      this.meta = this.meta.bind(this)
      this.handleSubmit = this.handleSubmit.bind(this)
    }

    private dispatch(action: Action) {
      this.setState(prevState => reduce(prevState, action))
    }

    private handleSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault()
      this.props.onSubmit && this.props.onSubmit(this.state.values)
    }

    private handleChange<TElement extends HTMLInputElement | HTMLSelectElement>(key: string) {
      return (event: React.ChangeEvent<TElement>) => {
        const value = event.target.value
        this.dispatch({
          type: 'FIELD_CHANGE',
          field: key,
          value: value
        })
      }
    }

    private handleBlur<TElement extends HTMLInputElement | HTMLSelectElement>(key: string) {
      return (event: React.FocusEvent<TElement>) => {
        this.dispatch({
          type: 'FIELD_BLUR',
          field: key
        })
      }
    }

    private meta(key: string): { touched: boolean } {
      return {
        touched: this.state.touched[key] || false
      }
    }

    render() {
      return (
        <FormComponent
          input={{
            select: field => ({
              value: this.state.values[field] || '',
              onChange: this.handleChange(field),
              onBlur: this.handleBlur(field),
              name: field,
              id: field
            }),
            text: field => ({
              value: this.state.values[field] || '',
              onChange: this.handleChange(field),
              onBlur: this.handleBlur(field),
              name: field,
              id: field
            }),
            selection: (field, value) => ({
              name: `${field}.${value}`,
              id: `${field}.${value}`,
              checked: this.state.values[field] === value,
              value,
              onChange: (e) => this.dispatch({
                type: 'FIELD_CHANGE',
                field,
                value: e.target.checked ? value : ''
              }),
              onBlur: this.handleBlur(field)
            }),
            toggle: (field) => ({
              name: field,
              id: field,
              checked: !!this.state.values[field],
              value: !!this.state.values[field] ? 'on' : 'unchecked',
              onChange: (e) => this.dispatch({
                type: 'FIELD_CHANGE',
                field,
                value: !!e.target.checked
              }),
              onBlur: this.handleBlur(field)
            })
          }}
          refresh={this.state.refresh}
          meta={this.meta}
          value={key => this.state.values[key]}
          enumerate={(key, cb) => {
            return Object.keys(this.state.values)
              .filter(x => x.startsWith(key))
              .map(x => cb({ key: x, value: this.state.values[x] }))
          }}
          push={(key, value) => this.dispatch({
            type: 'FIELD_PUSH',
            value,
            field: key
          })
          }
          change={(field, value) => this.dispatch({
            type: 'FIELD_CHANGE',
            value,
            field
          })}
          handleSubmit={this.handleSubmit}
        />
      )
    }
  }

  return Form
}
