import { create } from './path'

interface TestCase {
  path: string,
  value: any,
  result: Object
}

describe('path', () => {
  function test(name, { path, value, result }: TestCase) {
    it(name, () => {
      expect(create(path, value))
        .toEqual(result)
    })
  }

  test('creates obj', {
    path: 'a',
    value: 'foo',
    result: {
      a: 'foo'
    }
  })

  test('creates nested obj', {
    path: 'a.b',
    value: 'bar',
    result: {
      a: {
        b: 'bar'
      }
    }
  })

  test('creates array', {
    path: 'a[0]',
    value: 'bar',
    result: {
      a: ['bar']
    }
  })

  test('creates array with non-zero index', {
    path: 'a[1]',
    value: 'bar',
    result: {
      a: [undefined, 'bar']
    }
  })
})
