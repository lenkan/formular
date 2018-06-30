export function merge<T, K>(target: T, source: K): T & K {
  if (typeof source === 'object') {
    return <T & K>Object.keys(source).reduce((result: Object, key) => {
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