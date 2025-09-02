<script setup lang="ts">
const { pubDate, source } = defineProps<{
  pubDate: string
  source: NewsItem['source']
}>()

const date = computed(() => {
  const d = new Date(pubDate)

  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString()
})
</script>

<template>
  <div class="flex justify-between items-center">
    <ULink :to="source.url"> {{ source.name }} </ULink>
    <span>{{ date }}</span>
  </div>
</template>
