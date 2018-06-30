import { set, get } from 'lodash'

function expand(obj: { [key: string]: any }, path: string) {
  const result = {}

  Object.keys(obj).forEach(key => {
    set(result, key, obj[key])
  })

  if (path !== '') {
    return get(result, path)
  }

  return result
}

export default (obj: { [key: string]: any }, path: string = '') => expand(obj, path)