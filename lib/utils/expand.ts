import { create, parseKeys } from "./path";

type MinusKeys<T, U> = Pick<T, Exclude<keyof T, keyof U>>
type MergeResult<T, U> = MinusKeys<T, U> & MinusKeys<U, T> & MergedProperties<U, T>
type Defined<T> = T extends undefined ? never : T
type MergedProperties<T, U> = { [K in keyof T & keyof U]: undefined extends T[K] ? Defined<T[K] | U[K]> : T[K] }
// import { set, get } from 'lodash'

function mergeArrays(target: Array<any>, source: Array<any>) {
  const length = target.length > source.length ? target.length : source.length
  return new Array(length).fill(0)
    .map((_, index) => {
      return source[index] !== undefined ? source[index] : target[index]
    })
}

function merge<T extends object, K extends object>(target: T, source: K) {
  if (Array.isArray(source)) {
    return mergeArrays(Array.isArray(target) ? target : [], source)
  }

  if (typeof source === 'object') {
    return Object.keys(source).reduce((result: Object, key) => {
      const targetValue = target[key]
      const sourceValue = source[key]

      if (targetValue === undefined) {
        return { ...result, [key]: source[key] }
      }

      return {
        ...result,
        [key]: merge(targetValue, sourceValue)
      }
    }, target)
  }

  return source
}

export function expand(obj: { [key: string]: any }, path: string) {
  const result = Object.keys(obj).reduce((res, key) => {
    if (key.startsWith(path)) {
      return merge(res, create(key, obj[key]))
    }
    return res
  }, {})

  const pathKeys = path && parseKeys(path)
  if (pathKeys && pathKeys.length > 0) {
    return (path ? parseKeys(path) : []).reduce((res, key) => {
      return res[key] || {}
    }, result)
  }

  return result
}