import { isArray } from 'lodash-es'
import type { QueryValue } from 'ufo'

interface ParseParamToString {
  (param: QueryValue | QueryValue[]): string | null
  <T>(param: QueryValue | QueryValue[], defaultValue: T): string | T
}

export const parseParamToString: ParseParamToString = <T = null>(
  param: QueryValue | QueryValue[],
  defaultValue: T | null = null
) => {
  if (param === undefined || param === null || isArray(param)) {
    return defaultValue
  }

  return param
}
