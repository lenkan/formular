import reduce, { FormState } from './reducer'

function state(s: Partial<FormState>): FormState {
  return {
    touched: {},
    values: {},
    refresh: false,
    ...s
  }
}

describe('reduce', () => {
  describe('field change', () => {
    it('changes value in state', () => {
      expect(reduce(state({ values: { name: 'foo' } }), {
        type: 'FIELD_CHANGE',
        target: { name: 'foo', value: 'bar' }
      })).toMatchObject({
        values: { name: 'bar' }
      })
    })

    it('changes nested value in state', () => {
      const address = {
        street: 'Streetname',
        zipcode: 1337
      }

      expect(reduce(state({ values: { address } }), {
        type: 'FIELD_CHANGE',
        target: { value: 'Wall Street', name: 'address.street' }
      })).toMatchObject({
        values: {
          'address.street': 'Wall Street'
        }
      })
    })
  })

  describe('field push', () => {
    it('pushes new value as field to empty field array', () => {
      const result = reduce(state({ values: {} }), {
        type: 'FIELD_PUSH',
        field: 'interests',
        value: 'Hockey'
      })

      expect(result.values['interests.0']).toBe('Hockey')
    })

    it('pushes new value to existing field array', () => {
      const result = reduce(state({
        values: {
          'interests.0': 'Hockey',
          'interests.1': 'Moo'
        }
      }), {
          type: 'FIELD_PUSH',
          field: 'interests',
          value: 'chess'
        })

      expect(result.values['interests.2']).toBe('chess')
    })
  })

  describe('field remove', () => {
    it('pushes new value to existing field array', () => {
      const result = reduce(state({
        values: {
          'interests.0': 'Hockey',
          'interests.1': 'Moo'
        }
      }), {
          type: 'FIELD_REMOVE',
          field: 'interests',
          index: 0
        })

      expect(result.values).toEqual({
        'interests.0': 'Moo'
      })
    })
  })
})
