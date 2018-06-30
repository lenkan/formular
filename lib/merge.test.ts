import { merge } from "./merge";

describe('merge', () => {
  function test(target: Object, source: Object, expected: Object) {
    it('merges', () => {
      expect(merge(target, source)).toMatchObject(expected)
    })
  }

  test({ a: 1 }, { b: 2 }, { a: 1, b: 2 })
  test({ b: 1 }, { b: 2 }, { b: 2 })
  test({ a: 0, b: 1 }, { b: 2 }, { a: 0, b: 2 })
  test({ a: { foo: 'bar', baz: 'foo' } }, { a: { foo: 'baz' } },
    { a: { foo: 'baz', baz: 'foo' } }
  )
})
