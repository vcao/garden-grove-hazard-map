<script setup lang="ts">
const { data: posts } = await useAsyncData('news', () =>
  queryCollection('news').order('date', 'DESC').all()
)
</script>

<template>
  <div class="space-y-4">
    <p class="text-xs text-gray-500">
      Operator commentary &amp; situational updates. Add new entries by dropping markdown files into <code class="text-[10px]">content/news/</code>.
    </p>
    <article
      v-for="post in posts ?? []"
      :key="post.path"
      class="rounded border border-gray-200 p-3"
    >
      <header class="mb-2">
        <h3 class="font-semibold text-sm">{{ post.title }}</h3>
        <time class="text-xs text-gray-500 font-mono">{{ post.date }}</time>
      </header>
      <div class="prose prose-sm max-w-none">
        <ContentRenderer :value="post" />
      </div>
    </article>
    <div v-if="!posts?.length" class="text-sm text-gray-500 italic">
      No updates yet.
    </div>
  </div>
</template>
