import { reduce, FormState } from './store'

function state(s: Partial<FormState>): FormState {
  return {
    touched: {},
    values: {},
    ...s
  }
}

describe('reduce', () => {
  describe('field change', () => {
    it('changes value in state', () => {
      expect(reduce(state({ values: { name: 'foo' } }), {
        type: 'FIELD_CHANGE',
        field: 'name',
        value: 'bar'
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
        value: 'Wall Street',
        field: 'address.street'
      })).toMatchObject({
        values: {
          'address.street': 'Wall Street'
        }
      })
    })
  })

  describe('field array change', () => {
    it('indexes value under field array key', () => {
      const result = reduce(state({ values: {} }), {
        type: 'FIELD_ARRAY_CHANGE',
        field: 'interests',
        values: ['Hockey']
      })

      expect(result.values['interests[0]']).toBe('Hockey')
    })

    it('indexes multiple values to array key', () => {
      const result = reduce(state({
        values: {}
      }), {
          type: 'FIELD_ARRAY_CHANGE',
          field: 'interests',
          values: ['Hockey', 'Moo', 'chess']
        })

      expect(result.values['interests[2]']).toBe('chess')
    })

    it('removes old values', () => {
      const result = reduce(state({
        values: {
          'interests[0]': 'Hockey',
          'interests[1]': 'Moo'
        }
      }), {
          type: 'FIELD_ARRAY_CHANGE',
          field: 'interests',
          values: ['chess']
        })

      expect(result.values['interests[0]']).toBe('chess')
      expect(result.values['interests[1]']).toBeUndefined()
    })
  })
})