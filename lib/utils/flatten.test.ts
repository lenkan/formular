import flatten from "./flatten";

describe('flatten', () => {
  function test(name: string,
    { source, prefix, expected }: { source: Object, prefix?: string, expected: Object }) {
    it(name, () => {
      expect(flatten(source, prefix)).toMatchObject(expected)
    })
  }

  test('flattens simple object', {
    source: {
      a: { b: 1 }
    },
    expected: {
      'a.b': 1
    }
  })

  test('flattens nested array', {
    source: {
      a: ['foo', 'bar']
    },
    expected: {
      'a[0]': 'foo',
      'a[1]': 'bar'
    }
  })

  test('flattens array in root', {
    source: ['foo', 'bar'],
    expected: {
      '[0]': 'foo',
      '[1]': 'bar'
    }
  })

  test('adds prefix', {
    source: {
      a: 'foo',
      b: ['bar']
    },
    prefix: 'before',
    expected: {
      'before.a': 'foo',
      'before.b[0]': 'bar'
    }
  })
})

