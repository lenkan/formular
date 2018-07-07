export function parseKeys(path: string) {
  return path
    .replace(/\[(\d+)](\.?)/g, (match, index, dot) => `.[${index}]${dot}`)
    .split('.')
}

export function create(path: string, value: any) {
  const keys = parseKeys(path)
  const obj = {}

  keys.reduce((result, key, index) => {
    const isLast = index === keys.length - 1
    const isArray = !isLast && !!keys[index + 1].match(/\[(\d+)\]/)
    // const isArrayIndex = !!key.match(/\[(\d+)\]/)

    if (isArray) {
      const next = []
      result[key] = next
      return next
    }

    if (Array.isArray(result)) {
      const index = key.match(/\[(\d+)\]/)[1]
      const next = isLast ? value : {}
      result[index] = next
      return next
    }

    const next = isLast ? value : {}
    result[key] = next
    return next
  }, obj)

  return obj
}
