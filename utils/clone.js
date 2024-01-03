export const clone = (obj) => {
  let result = obj
  const type = {}.toString.call(obj).slice(8, -1)
  if (type === 'Set') {
    return new Set([...obj].map((value) => clone(value)))
  }
  if (type === 'Map') {
    return new Map([...obj].map((kv) => [clone(kv[0]), clone(kv[1])]))
  }
  if (type === 'Date') {
    return new Date(obj.getTime())
  }
  if (type === 'RegExp') {
    return RegExp(obj.source, getRegExpFlags(obj))
  }
  if (type === 'Array' || type === 'Object') {
    result = Array.isArray(obj) ? [] : {}
    for (const key in obj) {
      // include prototype properties
      result[key] = clone(obj[key])
    }
  }
  // primitives and non-supported objects (e.g. functions) land here
  return result
}

function getRegExpFlags (regExp) {
  if (typeof regExp.source.flags === 'string') {
    return regExp.source.flags
  } else {
    const flags = []
    regExp.global && flags.push('g')
    regExp.ignoreCase && flags.push('i')
    regExp.multiline && flags.push('m')
    regExp.sticky && flags.push('y')
    regExp.unicode && flags.push('u')
    return flags.join('')
  }
}
