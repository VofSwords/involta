import type { GetFeed, NewsProvider } from './types'
import { parseXML } from '../lib/xml-parser'
import { isArray } from 'lodash-es'

export type Enclosure = {
  '@_url': string
  '@_type': string
}

export type MosRuNewsItem = {
  title: string
  description?:
    | {
        __cdata: string
      }
    | string
  link: string
  pubDate: string
  enclosure?: Enclosure | Enclosure[]
}

export interface MosRuFeedRaw {
  '?xml': {
    '@_version': string
    '@_encoding': string
  }
  rss: {
    channel: {
      title: string
      link: string
      description: string
      item: MosRuNewsItem[]
    }
    '@_xmlns:yandex': string
    '@_xmlns:media': string
    '@_xmlns:infographic': string
    '@_version': string
  }
}

const getFeed: GetFeed = async () => {
  try {
    const resp = await $fetch<ArrayBuffer>('https://mos.ru/rss', { responseType: 'arrayBuffer' })

    const parsed = parseXML(resp) as MosRuFeedRaw

    const items = parsed.rss.channel.item
    const result: NewsItem[] = []

    // Transform data and filter invalid items
    for (const item of items) {
      const { title, link, description, enclosure } = item
      const pubDate = new Date(item.pubDate)
      if (!isValidDate(pubDate)) {
        continue
      }
      const enclosureItem = isArray(enclosure)
        ? enclosure.find((item) => item['@_type'].startsWith('image/'))
        : enclosure

      const descValue = description ? description : ''
      const descFinal = typeof descValue === 'string' ? descValue : descValue.__cdata ?? ''
      const res: NewsItem = {
        title,
        link,
        pubDate,
        description: descFinal,
        source: {
          name: 'mos.ru',
          url: 'https://www.mos.ru/',
        },
      }

      if (enclosureItem) {
        res.image = {
          src: enclosureItem['@_url'],
          type: enclosureItem['@_type'],
        }
      }

      result.push(res)
    }

    return result
  } catch (e) {
    console.error(e)
    return []
  }
}

const MosRuProvider: NewsProvider = {
  getFeed,
}

export { MosRuProvider }
