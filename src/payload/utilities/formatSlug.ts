import type { FieldHook } from 'payload/types'

const format = (val: string): string => {
  const base = val
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    .toLowerCase()

  // const randomSuffix = Math.random().toString(36).substring(2, 8) // 6-character random string
  // return `${base}-${randomSuffix}`
  return base
}

const formatSlug =
  (fallback: string): FieldHook =>
  ({ operation, value, originalDoc, data }) => {
    if (typeof value === 'string') {
      return format(value)
    }

    if (operation === 'create') {
      const fallbackData = data?.[fallback] || originalDoc?.[fallback]

      if (fallbackData && typeof fallbackData === 'string') {
        return format(fallbackData)
      }
    }

    return value
  }

export default formatSlug
