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

const page = computed(() => {
  return parseInt(parseParamToString(route.params.page, '1'))
})

const handlePageChange = (newPage: number) => {
  router.push(merge({}, route, { params: { page: newPage } }))
}
</script>

<template>
  <UContainer class="grow shrink-0 relative">
    <FeedHeader />
    <main class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <UCard v-for="i in 3" :key="i">
        <template #header>
          <ULink to="https://lenta.ru/" active>
            <h2 class="text-xl font-bold">
              Первые земельные участки реализованы на специальных торгах для малого и среднего
              бизнеса
            </h2>
          </ULink>
        </template>

        На каждый участок претендовали в среднем шесть участников. Стоимость одной из сделок выросла
        в ходе аукциона в 26 раз.

        <template #footer>
          <div>
            <div>
              <ULink to="https://lenta.ru/" active> Подробнее </ULink>
            </div>
            <div class="flex justify-between items-center">
              <ULink to="https://lenta.ru/"> lenta.ru </ULink>
              <span>12.01.2020</span>
            </div>
          </div>
        </template>
      </UCard>
    </main>
    <div class="flex justify-center items-center py-4">
      <UPagination :page="page" :total="200" size="sm" @update:page="handlePageChange" />
    </div>
  </UContainer>
</template>
