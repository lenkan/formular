import { createField } from "./field";
import { Action } from "./store";

function action(a: Action) {
  return a
}

function changeEvent(args: Partial<HTMLInputElement>) {
  function event<T extends HTMLElement>(element: T): React.ChangeEvent<T> {
    return {
      target: element,
      bubbles: false,
      currentTarget: element,
      cancelable: false,
      defaultPrevented: false,
      eventPhase: 1,
      isTrusted: false,
      nativeEvent: new Event('change'),
      preventDefault() { },
      isDefaultPrevented() { return false },
      stopPropagation() { },
      isPropagationStopped() { return false },
      persist() { },
      timeStamp: 1,
      type: ''
    }
  }

  const element = document.createElement('input')
  element.name = args.name || ''
  element.value = args.value || ''
  element.checked = !!args.checked
  return event(element)
}


const dispatch = jest.fn()

describe('field', () => {
  beforeEach(() => {
    dispatch.mockClear()
  })

  it('provides value', () => {
    const field = createField({
      field: 'foo',
      state: {
        value: 'bar',
        touched: false
      },
      dispatch
    })

    expect(field.value).toBe('bar')
  })

  it('provides touched state', () => {
    const field = createField({
      field: 'foo',
      state: {
        value: 'bar',
        touched: false
      },
      dispatch
    })

    expect(field.touched).toBe(false)
  })

  it('dispatches change action on change', () => {
    const field = createField({
      field: 'foo',
      state: {
        value: 'bar',
        touched: false
      },
      dispatch
    })

    field.change('baz')
    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(dispatch).toHaveBeenCalledWith(action({
      type: 'FIELD_CHANGE',
      field: 'foo',
      value: 'baz'
    }))
  })

  describe('text input', () => {
    it('handles change events', () => {
      const field = createField({
        field: 'foo',
        state: {
          value: 'bar',
          touched: false
        },
        dispatch
      })

      const input = field.text()
      input.onChange(changeEvent({ name: 'foo', value: 'tjoho' }))

      expect(dispatch).toHaveBeenCalledTimes(1)
      expect(dispatch).toHaveBeenCalledWith(action({
        type: 'FIELD_CHANGE',
        field: 'foo',
        value: 'tjoho'
      }))
    })
  })

  describe('checkbox', () => {
    it('is checked when state includes checkbox value', () => {
      const field = createField({
        field: 'foo',
        state: { value: ['thevalue'], touched: true },
        dispatch
      })

      const input = field.checkbox({ value: 'thevalue' })

      expect(input.checked).toBe(true)
      expect(input.value).toBe('thevalue')
    })

    it('is not checked when does not include checkbox value', () => {
      const field = createField({
        field: 'foo',
        state: {
          value: ['anothervalue'],
          touched: false
        },
        dispatch
      })

      const input = field.checkbox({ value: 'thevalue' })

      expect(input.checked).toBe(false)
      expect(input.value).toBe('thevalue')
    })

    it('adds value when checked', () => {
      const field = createField({
        field: 'foo',
        state: {
          value: ['anothervalue'],
          touched: false
        },
        dispatch
      })

      const input = field.checkbox({ value: 'thevalue' })
      input.onChange(changeEvent({ name: 'foo', value: 'thevalue', checked: true }))

      expect(input.checked).toBe(false)
      expect(input.value).toBe('thevalue')
    })
  })
})
