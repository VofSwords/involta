import { isArray } from 'lodash-es'

export const updateQueryString = (fullPath: string, key: string, value: string | null) => {
  const url = new URL(fullPath, 'https://example.com/')

  if (value === null) {
    url.searchParams.delete(key)
  } else {
    url.searchParams.set(key, value)
  }
  return url.toString().slice(url.origin.length)
}

type RouterParam = string | null | (string | null)[] | undefined

interface ParseParamToString {
  (param: RouterParam): string | null
  <T>(param: RouterParam, defaultValue: T): string | T
}

export const parseParamToString: ParseParamToString = <T = null>(
  param: RouterParam,
  defaultValue: T | null = null
) => {
  if (param === undefined || param === null || param.length === 0 || isArray(param)) {
    return defaultValue
  }

  return param
}
