function flatten(obj: Object | Array<any>, result: Object, prefix: string): { [key: string]: any } {
  if (Array.isArray(obj)) {
    return flatten(obj.reduce((res, value, index) => ({ ...res, [index]: value }), {}), result, prefix)
  }

  return Object.keys(obj).reduce((result, key) => {
    const value = obj[key]
    const path = [prefix, key].join('.').replace(/^\./, '')

    switch (typeof value) {
      case 'boolean':
      case 'number':
      case 'string':
      case 'undefined':
        result[path] = value
        break
      case 'object':
        flatten(value, result, path)
        break
    }
    return result
  }, result)
}

export default (obj: Object, prefix: string = '') => flatten(obj, {}, prefix)