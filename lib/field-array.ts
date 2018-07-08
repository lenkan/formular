import { FormField, createField } from './field'
import { Dispatcher } from './store'

export interface FormFieldArray {
  map<T>(cb: (field: FormField, index: number) => T): Array<T>
  push<T>(value: T): void
  remove(index: number): void
}

interface FieldArrayArgs {
  field: string
  fields: Array<{
    key: string,
    value: any,
    touched: boolean
  }>
  dispatch: Dispatcher
}

export function createFieldArray(args: FieldArrayArgs): FormFieldArray {
  const { field, fields, dispatch } = args
  return {
    map: cb => {
      return fields.map((f, index) => cb(createField({
        field: f.key,
        state: {
          value: f.value,
          touched: f.touched
        },
        dispatch
      }), index))
    },
    push: value => dispatch({
      type: 'FIELD_ARRAY_CHANGE',
      field,
      values: [...fields.map(x => x.value), value],
    }),
    remove: index => dispatch({
      type: 'FIELD_ARRAY_CHANGE',
      field,
      values: fields.filter((_x, i) => i !== index).map(x => x.value)
    })
  }
}