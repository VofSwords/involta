<script setup lang="ts">
const { url, pubDate } = defineProps<{
  url: string
  pubDate: string
}>()

const date = computed(() => {
  const d = new Date(pubDate)

  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString()
})
</script>

<template>
  <div class="flex justify-between items-center">
    <ULink :to="url"> source </ULink>
    <span>{{ date }}</span>
  </div>
</template>
