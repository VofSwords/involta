<script setup lang="ts">
import { debounce, merge } from 'lodash-es'
import { useUserSettings } from '~/composables/use-user-settings'

const router = useRouter()
const route = useRoute()
const setRouterQuery = (key: string, value: string | null) => {
  router.push(merge({}, route, { params: { page: 1 }, query: { [key]: value } }))
}

const { feedLayout } = useUserSettings()

const { searchValue, selectedProvider } = useFeed()

const searchString = ref<string>(searchValue.value)

const updateSearch = () => {
  if (searchString.value.length === 0) {
    setRouterQuery('search', null)
    return
  }

  setRouterQuery('search', searchString.value)
}

watch(searchString, debounce(updateSearch, 300))
</script>

<template>
  <header class="relative top-0 left-0 right-0">
    <div
      class="flex flex-col sm:flex-row sm:justify-between flex-wrap items-stretch sm:items-center gap-2 sm:gap-8 py-3 sm:py-5"
    >
      <div class="flex justify-between items-center gap-4">
        <h1 class="text-2xl sm:text-3xl">Список новостей</h1>
        <UButton icon="material-symbols:sync" to="/" size="md" color="primary" variant="solid" />
      </div>
      <UInput
        v-model="searchString"
        icon="i-lucide-search"
        size="md"
        variant="subtle"
        placeholder="Search..."
      />
    </div>
    <USeparator />
    <div class="flex items-center justify-between gap-4 flex-wrap py-2">
      <UButtonGroup>
        <UButton
          label="Все"
          variant="subtle"
          color="neutral"
          active-color="primary"
          :active="selectedProvider === null"
          @click="setRouterQuery('provider', null)"
        />
        <UButton
          variant="subtle"
          label="Mos.ru"
          color="neutral"
          active-color="primary"
          :active="selectedProvider === NewsProviderNamesEnum.mosRu"
          @click="setRouterQuery('provider', NewsProviderNamesEnum.mosRu)"
        />
        <UButton
          variant="subtle"
          label="Lenta.ru"
          color="neutral"
          active-color="primary"
          :active="selectedProvider === NewsProviderNamesEnum.lentaRu"
          @click="setRouterQuery('provider', NewsProviderNamesEnum.lentaRu)"
        />
      </UButtonGroup>
      <UButtonGroup>
        <UButton
          icon="fluent:layout-row-three-20-filled"
          variant="subtle"
          color="neutral"
          active-color="primary"
          :active="feedLayout === 'list'"
          @click="feedLayout = 'list'"
        />
        <UButton
          icon="fluent:layout-cell-four-20-filled"
          variant="subtle"
          color="neutral"
          active-color="primary"
          :active="feedLayout === 'cards'"
          @click="feedLayout = 'cards'"
        />
      </UButtonGroup>
    </div>
  </header>
</template>
