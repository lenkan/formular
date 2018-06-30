import expand from "./expand"

describe('expand', () => {
  function test(source: Object, path: string, expected: Object | undefined) {
    it(`expands ${JSON.stringify(source)} -> ${JSON.stringify(expected)}`, () => {
      expect(expand(source, path)).toEqual(expected)
    })
  }

  test({ 'a.b': 1 }, '', { a: { b: 1 } })
  test({ 'a.b': 1 }, 'a', { b: 1 })
  test({ 'a.0': 1, 'a.1': 2 }, 'a', [1, 2])
  test({ 'a.0': 1, 'a.1': 2 }, '', { a: [1, 2] })
  test({ 'something': 1 }, 'else', undefined)
})

