import * as React from 'react'

type FormInput<TValue> = {
  value: TValue,
  onChange: React.ChangeEventHandler
}

type FormHandler<TValue> = { [P in keyof TValue]: FormHandler<TValue[P]> } & { input: FormInput<TValue> }

type Field<TValue> = (FormHandler<TValue> | {
  input: TValue,
  onChange: React.ChangeEventHandler
})

export interface FormComponentProps<T> {
  fields: FormHandler<T>
}

type Form<T> = React.ComponentClass<FormComponentProps<T>> | React.StatelessComponent<FormComponentProps<T>>

type FormProps<T> = {
  defaultValue?: T,
  onSubmit?: (value: T) => any
}

interface FormState<T> {
  fields: {
    [key: string]: {
      value: any
    }
  }
}

export function form<T>(FormComponent: Form<T>): React.ComponentClass<FormProps<T>> {
  class Form extends React.Component<FormProps<T>, FormState<T>> {
    constructor(props: FormProps<T>) {
      super(props)
      this.state = {
        fields: {}
      }

      this.input = this.input.bind(this)
    }

    private handleChange(field: string) {
      return (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        this.setState(s => ({
          fields: {
            ...s.fields,
            [field]: {
              ...s.fields[field],
              value
            }
          }
        }))
      }
    }

    private input(picker: (s: T) => any): Field {
      const field = picker(this.state.fields)
      // this.state.fields[key]
      return {
        value: field ? field.value : undefined,
        onChange: this.handleChange(key)
      }
    }

    render() {
      const foo = (key) : FormHandler => {

      }

      // const handler: FormHandler<T> = {
      //   [key: P in keyof T]: foo(key)
      // }

      return (
        <FormComponent fields={handler} />
      )
    }
  }

  return Form
}
