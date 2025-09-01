import { includes } from 'lodash-es'

export const useFeed = () => {
  const route = useRoute()

  const selectedProvider = computed(() => {
    const provider = parseParamToString(route.query.provider)

    if (!provider) return null

    const isAllowed = includes(providersNames, provider)

    if (!isAllowed) {
      return null
    }

    return provider as NewsProviderName
  })

  const searchValue = computed(() => {
    return parseParamToString(route.query.search, '')
  })

  const currentPage = computed(() => {
    const val = parseInt(parseParamToString(route.params.page, '1'))
    return val > 0 ? val : 1
  })

  return {
    selectedProvider,
    searchValue,
    currentPage,
  }
}
