import { concat } from 'lodash-es'
import { LentaRuProvider } from '../news-providers/lenta-ru'
import { MosRuProvider } from '../news-providers/mos-ru'
import { parseParamToString } from '../utils/params'

export default defineEventHandler(async (event) => {
  const queryParams = getQuery(event)

  const skipParam = Number(parseParamToString(queryParams.skip, '0')).valueOf()
  const limitParam = Number(parseParamToString(queryParams.limit, +Infinity)).valueOf()
  const providerParam = parseParamToString(queryParams.provider)
  const searchParam = parseParamToString(queryParams.search)

  const skip = isNaN(skipParam) ? 0 : Math.max(skipParam, 0)
  const limit = isNaN(limitParam) ? +Infinity : Math.max(limitParam, 0)
  const provider = providerParam

  const dataRequests: Promise<NewsItem[]>[] = []

  if (provider === 'lenta-ru' || !provider) {
    dataRequests.push(LentaRuProvider.getFeed())
  }
  if (provider === 'mos-ru' || !provider) {
    dataRequests.push(MosRuProvider.getFeed())
  }

  const dataResults = await Promise.all(dataRequests)

  const data = concat([], ...dataResults)
  const dataFiltered = searchParam
    ? data.filter(
        (item) => item.title.includes(searchParam) || item.description.includes(searchParam)
      )
    : data
  const dataSorted = dataFiltered.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())

  return {
    limit,
    skip,
    data: dataSorted.slice(skip, skip + limit),
    total: dataSorted.length,
  }
})
