import type { GetFeed, NewsProvider } from './types'
import { parseXML } from '../lib/xml-parser'

export interface Enclosure {
  '@_url': string
  '@_type': string
  '@_length': string
}

export interface LentaRuNewsItem {
  guid: string
  author: string
  title: string
  link: string
  description?:
    | {
        __cdata: string
      }
    | string
  pubDate: string
  enclosure?: Enclosure
  category: string
}

export interface LentaRuFeedRaw {
  rss: {
    channel: {
      language: string
      title: string
      description: string
      link: string
      image: {
        url: string
        title: string
        link: string
        widht: number
        height: number
      }
      item: LentaRuNewsItem[]
    }
  }
}

const getFeed: GetFeed = async () => {
  try {
    const resp = await $fetch<ArrayBuffer>('https://lenta.ru/rss', { responseType: 'arrayBuffer' })

    const parsed = parseXML(resp) as LentaRuFeedRaw

    const items = parsed.rss.channel.item
    const result: NewsItem[] = []

    // Transform data and filter invalid items
    for (const item of items) {
      const { title, link, description, enclosure } = item
      const pubDate = new Date(item.pubDate)
      if (!isValidDate(pubDate)) {
        continue
      }

      const descValue = description ? description : ''
      const descFinal = typeof descValue === 'string' ? descValue : descValue.__cdata ?? ''

      const res: NewsItem = {
        title,
        link,
        pubDate,
        description: descFinal,
      }

      if (enclosure) {
        res.image = {
          src: enclosure['@_url'],
          type: enclosure['@_type'],
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

const LentaRuProvider: NewsProvider = {
  getFeed,
}

export { LentaRuProvider }
