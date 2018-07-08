import { createFieldArray } from "./field-array";
import { Action } from "./store";

const dispatch = jest.fn()

function action(a: Action) {
  return a
}

describe('field array', () => {
  beforeEach(() => dispatch.mockClear())

  it('dispatches array change action on push', () => {
    const array = createFieldArray({
      field: 'interests',
      fields: [
        {
          key: 'interests[0]',
          value: 'chess',
          touched: false
        }
      ],
      dispatch
    })

    array.push('hockey')

    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(dispatch).toHaveBeenCalledWith(action({
      type: 'FIELD_ARRAY_CHANGE',
      field: 'interests',
      values: ['chess', 'hockey']
    }))
  })

  it('dispatches array change action on remove', () => {
    const array = createFieldArray({
      field: 'interests',
      fields: [
        {
          key: 'interests[0]',
          value: 'chess',
          touched: false
        },
        {
          key: 'interests[1]',
          value: 'hockey',
          touched: false
        }
      ],
      dispatch
    })

    array.remove(1)

    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(dispatch).toHaveBeenCalledWith(action({
      type: 'FIELD_ARRAY_CHANGE',
      field: 'interests',
      values: ['chess']
    }))
  })
})
