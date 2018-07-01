import flatten from './utils/flatten';
import expand from './utils/expand';

type FormValueMap = {
  [key: string]: any
}

type FormTouchedMap = {
  [key: string]: boolean
}

export interface FormState {
  values: FormValueMap
  touched: FormTouchedMap
  refresh: boolean
}

interface ChangeAction {
  type: 'FIELD_CHANGE'
  target: HTMLInputElement | { name: string, value: any }
}

interface BlurAction {
  field: string
  type: 'FIELD_BLUR'
}

interface PushAction {
  field: string
  type: 'FIELD_PUSH',
  value: any
}

interface RemoveAction {
  field: string,
  type: 'FIELD_REMOVE',
  index: number
}

export type Action = ChangeAction | BlurAction | PushAction | RemoveAction

const initialState: FormState = {
  values: {},
  touched: {},
  refresh: false
}

function readChangeValue(values, event) {
  console.log(event)
  const target = event
  if (target instanceof HTMLInputElement) {
    const name = target.name
    switch (target.type) {
      case 'checkbox':
        if (target.checked) {
          return {
            ...values,
            [name]: target.value
              ? [...Array.isArray(values[name]) ? values[name] : [], target.value]
              : true
          }
        }
        return {
          ...values,
          [name]: target.value
            ? (Array.isArray(values[name]) ? values[name] : []).filter(x => x !== target.value)
            : false
        }
      case 'radio':
        return {
          ...values,
          [name]: target.value
        }
      default:
        return {
          ...values,
          [name]: target.value
        }
    }
  }
  throw new Error('Custom not supported')
}

function reduce(prevState: FormState = initialState, action: Action): FormState {
  switch (action.type) {
    case 'FIELD_BLUR':
      return {
        ...prevState,
        touched: {
          ...prevState.touched,
          [action.field]: true
        }
      }
    case 'FIELD_CHANGE':
      return {
        ...prevState,
        values: readChangeValue(prevState.values, action.target)
      }
    case 'FIELD_PUSH':
      return {
        ...prevState,
        values: {
          ...prevState.values,
          ...flatten([
            ...expand(prevState.values, action.field) || [],
            action.value
          ], action.field)
        },
        refresh: !prevState.refresh
      }
    case 'FIELD_REMOVE':
      return {
        ...prevState,
        values: {
          ...Object.keys(prevState.values).reduce((res, key) => {
            if (!key.startsWith(action.field)) {
              res[key] = prevState.values[key]
            }
            return res
          }, {}),
          ...flatten([
            ...(expand(prevState.values, action.field) || []).filter((x, index) => index !== action.index)
          ], action.field)
        }
      }
    default:
      return prevState
  }
}

export type Dispatcher = (action: Action) => void

export default (prevState: FormState = initialState, action: Action) => {
  const newState = reduce(prevState, action)
  console.log(JSON.stringify(newState, null, 2))
  return newState
}