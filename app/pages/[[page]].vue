<script setup lang="ts">
import { merge } from 'lodash-es'

definePageMeta({
  validate: async (route) => {
    const value = parseInt(parseParamToString(route.params.page, '1'))

    return isNaN(value) === false
  },
})

const router = useRouter()
const route = useRoute()

const { feedLayout, loadUserSettings } = useUserSettings()

const page = computed(() => {
  return parseInt(parseParamToString(route.params.page, '1'))
})

const handlePageChange = (newPage: number) => {
  router.push(merge({}, route, { params: { page: newPage } }))
}

onMounted(() => {
  loadUserSettings()
})
</script>

<template>
  <UContainer class="grow shrink-0 relative">
    <FeedHeader />
    <main v-if="feedLayout === 'list'" class="flex flex-col gap-4">
      <UCard v-for="i in 3" :key="i">
        <div class="flex items-stretch gap-4 mb-6">
          <div>
            <FeedCardTitleLink />
            <p>
              На каждый участок претендовали в среднем шесть участников. Стоимость одной из сделок
              выросла в ходе аукциона в 26 раз.
            </p>
          </div>
        </div>
        <FeedCardFooter />
      </UCard>
    </main>
    <main v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <UCard v-for="i in 3" :key="i">
        <template #header>
          <FeedCardTitleLink />
        </template>

        На каждый участок претендовали в среднем шесть участников. Стоимость одной из сделок выросла
        в ходе аукциона в 26 раз.

        <template #footer>
          <div>
            <div>
              <ULink to="https://lenta.ru/" active> Подробнее </ULink>
            </div>
            <FeedCardFooter />
          </div>
        </template>
      </UCard>
    </main>

    <div class="flex justify-center items-center py-4">
      <UPagination :page="page" :total="200" size="sm" @update:page="handlePageChange" />
    </div>
  </UContainer>
</template>
