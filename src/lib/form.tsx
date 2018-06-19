import * as React from 'react'

interface InputHandler {
  value: any,
  onChange: React.ChangeEventHandler
}

export interface FormComponentProps {
  input: (field: string) => InputHandler
}


type Form = React.ComponentClass<FormComponentProps> | React.StatelessComponent<FormComponentProps>

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

export function form<T>(FormComponent: Form): React.ComponentClass<FormProps<T>> {
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

    private input(key: string): InputHandler {
      const field = this.state.fields[key]
      return {
        value: field ? field.value : undefined,
        onChange: this.handleChange(key)
      }
    }

    render() {
      console.log(JSON.stringify(this.state, null, 2))
      return (
        <FormComponent input={this.input} />
      )
    }
  }

  return Form
}
