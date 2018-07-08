import { FocusEventHandler, ChangeEventHandler, ChangeEvent } from 'react'
import { Dispatcher } from "./store"

type InputType = 'text'

/**
 * The supported HTML elements
 */
type HTMLElements = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement


interface ElementController<T extends HTMLElements> {
  type?: InputType | 'radio' | 'checkbox'
  checked?: boolean
  id: string
  name: string
  value?: string | string[] | number
  onChange: ChangeEventHandler<T>
  onBlur: FocusEventHandler<T>
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


// type InputOptions =
//   ({ type: TextInputOptions['type'] } & TextInputOptions) |
//   ({ type: 'radio' } & RadioButtonOptions) |
//   ({ type: 'checkbox' } & CheckboxOptions) |
//   ({ type: 'select' } & SelectOptions) |
//   ({ type: 'textarea' } & TextareaOptions)

export interface FormField {
  /**
   * Gets the key that identifies this field
   */
  readonly key: string

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
  change(value: any): void

  text(options?: TextInputOptions): ElementController<HTMLInputElement>
  textarea(options?: TextareaOptions): ElementController<HTMLTextAreaElement>
  checkbox(options?: CheckboxOptions): ElementController<HTMLInputElement>
  radio(options?: RadioButtonOptions): ElementController<HTMLInputElement>
  select(options?: SelectOptions): ElementController<HTMLSelectElement>
}

function readChangeValue<T extends HTMLElements>(previousValue: any, target: T) {
  if (target instanceof HTMLInputElement) {
    switch (target.type) {
      case 'checkbox':
        if (target.checked) {
          return target.value
            ? [...Array.isArray(previousValue) ? previousValue : [], target.value]
            : true
        }
        return target.value
          ? (Array.isArray(previousValue) ? previousValue : []).filter(x => x !== target.value)
          : false
      case 'radio':
        return target.value
      default:
        return target.value
    }
  }
  if (target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) {
    return target.value
  }

  return undefined
}


export function createField(args: { field: string, state: { value: any, touched: boolean }, dispatch: Dispatcher }): FormField {
  const { field, state, dispatch } = args

  function handleChange<T extends HTMLElements>(event: ChangeEvent<T>) {
    dispatch({
      type: 'FIELD_CHANGE',
      field,
      value: readChangeValue(state.value, event.currentTarget)
    })
  }

  function handleBlur() {
    dispatch({
      type: 'FIELD_BLUR',
      field
    })
  }

  function text(_options?: TextInputOptions): ElementController<HTMLInputElement> {
    return {
      id: field,
      name: field,
      value: state.value || '',
      type: 'text',
      onChange: handleChange,
      onBlur: handleBlur
    }
  }

  function textarea(_options?: TextareaOptions): ElementController<HTMLTextAreaElement> {
    return {
      id: field,
      name: field,
      value: state.value,
      onChange: handleChange,
      onBlur: handleBlur
    }
  }

  function select(_options: SelectOptions): ElementController<HTMLSelectElement> {
    return {
      id: field,
      name: field,
      value: state.value || '',
      onChange: handleChange,
      onBlur: handleBlur
    }
  }

  function radio(options: RadioButtonOptions): ElementController<HTMLInputElement> {
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

  function checkbox(options: CheckboxOptions = {}): ElementController<HTMLInputElement> {
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
    key: field,
    value: state.value,
    touched: state.touched,
    change: value => dispatch({ type: 'FIELD_CHANGE', field, value }),
    textarea,
    text,
    checkbox,
    radio,
    select
  }
}