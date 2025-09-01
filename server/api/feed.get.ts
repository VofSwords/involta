import { LentaRuProvider } from '../news-providers/lenta-ru'

export default defineEventHandler(async () => {
  const data = await LentaRuProvider.getFeed()

  return {
    data,
  }
})
