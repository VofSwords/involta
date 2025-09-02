import { values } from 'lodash-es'

export interface NewsItem {
  title: string
  pubDate: Date
  link: string
  source: {
    name: string
    url: string
  }
  description: string
  image?: {
    src: string
    type: string
  }
}

export enum NewsProviderNamesEnum {
  lentaRu = 'lenta-ru',
  mosRu = 'mos-ru',
}

export type NewsProviderName = `${NewsProviderNamesEnum}`

export const providersNames = values(NewsProviderNamesEnum)
