import { includes, merge, values } from 'lodash-es'

enum FeedLayoutsEnum {
  cards = 'cards',
  list = 'list',
}
type FeedLayout = `${FeedLayoutsEnum}`
const feedLayouts = values(FeedLayoutsEnum)

interface Settings {
  feedLayout: FeedLayout
}
const defaultSettings: Settings = Object.freeze({
  feedLayout: 'cards',
})

const STORAGE_KEY = 'settings'

const getSavedSettings = () => {
  try {
    const settings = localStorage.getItem(STORAGE_KEY)
    if (!settings) {
      return {}
    }

    return JSON.parse(settings)
  } catch (e) {
    console.error(e)
    return {}
  }
}

export const useUserSettingsStore = defineStore('user-settings', () => {
  const isClient = useState('is-client', () => false)
  const feedLayout = useState('feed-layout', () => defaultSettings.feedLayout)

  const loadUserSettings = () => {
    isClient.value = import.meta.client

    if (isClient.value) {
      const savedSettings = getSavedSettings()

      const settings = merge({}, defaultSettings, savedSettings)

      if (includes(feedLayouts, settings.feedLayout)) {
        feedLayout.value = settings.feedLayout
      }
    }
  }

  watch(feedLayout, (newValue) => {
    if (isClient.value) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ feedLayout: newValue }))
    }
  })

  return {
    feedLayout,
    isClient,
    loadUserSettings,
  }
})
