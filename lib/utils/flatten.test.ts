import flatten from "./flatten";

describe('flatten', () => {
  function test(source: Object, prefix: string, expected: Object) {
    it(`flattens ${source} -> ${expected}`, () => {
      expect(flatten(source)).toMatchObject(expected)
    })
  }

  test({ a: { b: 1 } }, '', { 'a.b': 1 })
  test({ a: ['foo', 'bar'] }, '', { 'a.0': 'foo', 'a.1': 'bar' })
  test(['foo', 'bar'], '', { '0': 'foo', '1': 'bar' })
})

