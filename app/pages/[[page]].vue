<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { merge } from 'lodash-es'

definePageMeta({
  validate: async (route) => {
    const value = parseInt(parseParamToString(route.params.page, '1'))

    return isNaN(value) === false && value > 0
  },
})

const router = useRouter()
const route = useRoute()

const userSettingsStore = useUserSettingsStore()

const { searchValue, selectedProvider, currentPage } = useFeed()

const handlePageChange = (newPage: number) => {
  router.push(merge({}, route, { params: { page: newPage } }))
}

onMounted(() => {
  userSettingsStore.loadUserSettings()
})

const LIMIT = 4

const { data, isLoading, suspense } = useQuery({
  queryKey: ['feed', { currentPage, searchValue, selectedProvider }],
  queryFn: async () => {
    const resp = await $fetch('/api/feed', {
      query: {
        limit: LIMIT,
        skip: (currentPage.value - 1) * LIMIT,
        provider: selectedProvider.value,
        search: searchValue.value,
      },
    })

    return resp
  },
})

const totalPages = computed(() => {
  if (!data.value) return 1
  return Math.floor(data.value.total / LIMIT) + 1
})

watch(totalPages, (v) => {
  console.log(v)
})

onServerPrefetch(async () => {
  await suspense()
})
</script>

<template>
  <UContainer class="grow shrink-0 relative">
    <FeedHeader />
    <main v-if="isLoading">Loading</main>
    <main v-else-if="data">
      <div v-if="data.data.length === 0">No data</div>
      <div v-else-if="userSettingsStore.feedLayout === 'list'" class="flex flex-col gap-4">
        <UCard v-for="post in data.data" :key="post.link">
          <div class="flex items-stretch gap-4 mb-6">
            <div>
              <FeedCardTitleLink :url="post.link" :text="post.title" />
              <p>
                {{ post.description }}
              </p>
            </div>
          </div>
          <FeedCardFooter :url="post.link" :pub-date="post.pubDate" />
        </UCard>
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <UCard v-for="post in data.data" :key="post.link">
          <template #header>
            <FeedCardTitleLink :url="post.link" :text="post.title" />
          </template>

          {{ post.description }}

          <template #footer>
            <div>
              <div>
                <ULink :to="post.link" active> Подробнее </ULink>
              </div>
              <FeedCardFooter :url="post.link" :pub-date="post.pubDate" />
            </div>
          </template>
        </UCard>
      </div>

      <div class="flex justify-center items-center py-4">
        <UPagination
          :page="currentPage"
          :total="data.total"
          :items-per-page="LIMIT"
          size="sm"
          @update:page="handlePageChange"
        />
      </div>
    </main>

    <main v-else>Error</main>
  </UContainer>
</template>
