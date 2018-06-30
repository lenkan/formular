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
  field: string
  type: 'FIELD_CHANGE'
  value: any
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

export type Action = ChangeAction | BlurAction | PushAction

const initialState: FormState = {
  values: {},
  touched: {},
  refresh: false
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
          [action.field]: action.value
        }
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
    default:
      return prevState
  }
}

export default (prevState: FormState = initialState, action: Action) => {
  const newState = reduce(prevState, action)
  return newState
}