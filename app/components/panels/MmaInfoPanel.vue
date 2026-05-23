<script setup lang="ts">
const { data: doc } = await useAsyncData('mma-info', () =>
  queryCollection('mma').first()
)
</script>

<template>
  <div class="prose prose-sm max-w-none">
    <ContentRenderer v-if="doc" :value="doc" />
    <p v-else class="text-sm text-gray-500 italic">Loading…</p>
  </div>
</template>
