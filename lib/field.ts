import * as React from 'react'
import { Action, Dispatcher, FormState } from "./reducer";

type InputType = 'text'

interface HTMLElementListener {
  type?: InputType | 'radio' | 'checkbox'
  checked?: boolean
  id: string
  name: string
  value?: string | string[] | number
  onChange: (event: { target: { name: string, value: string, checked?: boolean } }) => void
  onBlur: React.FocusEventHandler
}

interface RadioButtonOptions {
  value: string
}

interface CheckboxOptions {
  value?: string
}

interface TextInputOptions {
  type: 'text'
}

interface SelectOptions {
}

interface TextareaOptions {
}


type InputOptions =
  ({ type: TextInputOptions['type'] } & TextInputOptions) |
  ({ type: 'radio' } & RadioButtonOptions) |
  ({ type: 'checkbox' } & CheckboxOptions) |
  ({ type: 'select' } & SelectOptions) |
  ({ type: 'textarea' } & TextareaOptions)

export interface FormField {
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
  input(options: InputOptions): HTMLElementListener

  checkbox(options?: CheckboxOptions): HTMLElementListener
  radio(options?: RadioButtonOptions): HTMLElementListener
  select(options?: SelectOptions): HTMLElementListener
}

export function createField(args: { field: string, state: { value: any, touched: boolean }, dispatch: Dispatcher }): FormField {
  const { field, state, dispatch } = args

  function handleChange(event) {
    dispatch({
      type: 'FIELD_CHANGE',
      target: event.target ? event.target : event
    })
  }

  function handleBlur() {
    dispatch({
      type: 'FIELD_BLUR',
      field
    })
  }

  function input(options: TextInputOptions): HTMLElementListener {
    return {
      id: field,
      name: field,
      value: state.value || '',
      type: options.type,
      onChange: handleChange,
      onBlur: handleBlur
    }
  }

  function select(options: SelectOptions): HTMLElementListener {
    return {
      id: field,
      name: field,
      value: state.value || '',
      onChange: handleChange,
      onBlur: handleBlur
    }
  }

  function radio(options: RadioButtonOptions): HTMLElementListener {
    const checked = state.value === options.value

    return {
      type: 'radio',
      name: field,
      id: `${field}.${options.value}`,
      checked,
      value: options.value,
      onChange: handleChange,
      onBlur: handleBlur
    }
  }

  function checkbox(options: CheckboxOptions): HTMLElementListener {
    return {
      type: 'checkbox',
      name: field,
      id: options.value ? `${field}.${options.value}` : field,
      checked: Array.isArray(state.value) ? state.value.indexOf(options.value) !== -1 : !!state.value,
      value: options.value,
      // checked: Array.isArray(state.value) && state.value.indexOf(options.value) !== -1,
      onChange: handleChange,
      onBlur: handleBlur
    }
  }

  return {
    value: state.value,
    touched: state.touched,
    change: value => dispatch({ type: 'FIELD_CHANGE', target: { name: field, value } }),
    input: options => {
      switch (options.type) {
        case 'text':
          return input(options)
        case 'select':
          return select(options)
        case 'checkbox':
          return checkbox(options)
        case 'radio':
          return radio(options)
        default:
          return undefined
      }
    },
    checkbox,
    radio,
    select
  }
}