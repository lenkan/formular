import flatten from './utils/flatten';

type FormValueMap = {
  [key: string]: any
}

type FormTouchedMap = {
  [key: string]: boolean
}

export interface FormState {
  values: FormValueMap
  touched: FormTouchedMap
}

interface ChangeAction {
  type: 'FIELD_CHANGE',
  field: string,
  value: any
}

interface BlurAction {
  field: string
  type: 'FIELD_BLUR'
}

interface ArrayChangeAction {
  field: string,
  type: 'FIELD_ARRAY_CHANGE',
  values: Array<any>
}

export type Action = ChangeAction | BlurAction | ArrayChangeAction
export type Dispatcher = (action: Action) => void

const initialState: FormState = {
  values: {},
  touched: {}
}

export function reduce(prevState: FormState = initialState, action: Action): FormState {
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
    case 'FIELD_ARRAY_CHANGE':
      return {
        ...prevState,
        values: {
          ...Object.keys(prevState.values)
            .filter(key => !key.startsWith(action.field))
            .reduce((res, key) => ({ ...res, [key]: prevState.values[key] }), {}),
          ...flatten(action.values, action.field)
        }
      }
    default:
      return prevState
  }
}
