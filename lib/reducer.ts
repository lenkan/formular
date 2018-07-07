import flatten from './utils/flatten';
import { expand } from './utils/expand';

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

function readChangeValue(previousValue: any, target: ChangeAction['target']) {
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
  return target.value
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
        values: {
          ...prevState.values,
          [action.target.name]: readChangeValue(prevState.values[action.target.name], action.target)
        }
      }
    case 'FIELD_PUSH':
      const expanded = expand(prevState.values, action.field)
      return {
        ...prevState,
        values: {
          ...prevState.values,
          ...flatten([...Array.isArray(expanded) ? expanded : [], action.value], action.field)
        },
        refresh: !prevState.refresh
      }
    case 'FIELD_REMOVE':
      const a = expand(prevState.values, action.field)
      return {
        ...prevState,
        values: {
          ...Object.keys(prevState.values).reduce((res, key) => {
            if (!key.startsWith(action.field)) {
              res[key] = prevState.values[key]
            }
            return res
          }, {}),
          ...flatten(
            (Array.isArray(a) ? a : []).filter((x, index) => index !== action.index),
            action.field
          )
        }
      }
    default:
      return prevState
  }
}

export type Dispatcher = (action: Action) => void

export default (prevState: FormState = initialState, action: Action) => {
  const newState = reduce(prevState, action)
  return newState
}