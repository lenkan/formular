import { expand } from "./expand"

interface TestCase {
  source: Object,
  path?: string,
  expected: Object
}

describe('expand', () => {
  function test({ source, path = '', expected }: TestCase) {
    return () => expect(expand(source, path)).toEqual(expected)
  }

  it('expands nested property', test({
    source: { 'a.b': 1 },
    expected: { a: { b: 1 } }
  }))

  it('expands properties in filter', test({
    source: { 'a.b': 1, 'b.a': 2 },
    path: 'a',
    expected: { b: 1 } 
  }))

  it('expands array property', test({
    source: { 'a[0]': 1, 'a[1]': 2 },
    expected: { a: [1, 2] }
  }))

  it('expands numbered properties to object', test({
    source: { 'a.0': 1 },
    expected: { a: { 0: 1 } }
  }))

  it('returns empty if path does not exist', test({
    source: { 'something': 1 },
    path: 'else',
    expected: {}
  }))
})

