import { values } from 'lodash-es'

export interface NewsItem {
  title: string
  pubDate: Date
  link: string
  description: string
}

export enum NewsProviderNamesEnum {
  lentaRu = 'lenta-ru',
  mosRu = 'mos-ru',
}

export type NewsProviderName = `${NewsProviderNamesEnum}`

export const providersNames = values(NewsProviderNamesEnum)
