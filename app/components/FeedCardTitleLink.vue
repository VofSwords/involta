<script setup lang="ts">
const { url, text } = defineProps<{
  url: string
  text: string
}>()
</script>

<template>
  <ULink :to="url" active>
    <h2 class="text-xl font-bold">
      {{ text }}
    </h2>
  </ULink>
</template>
