<template>
  <div class="space-y-4">
    <a
      href="https://x.com/OCFireAuthority"
      target="_blank"
      rel="noopener"
      class="cta-card"
    >
      <div class="flex items-start gap-3">
        <div class="cta-avatar">
          <UIcon name="i-lucide-flame" class="size-5" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-1.5">
            <span class="font-semibold text-sm text-gray-900">Orange County Fire Authority</span>
            <UIcon name="i-lucide-external-link" class="size-3 text-gray-400" />
          </div>
          <div class="text-xs text-gray-500">@OCFireAuthority</div>
          <div class="text-xs text-gray-600 mt-1.5 leading-snug">
            Live incident updates, evacuation orders, and shelter information. Open on X.com for the latest posts.
          </div>
        </div>
      </div>
    </a>
  </div>
</template>

<style scoped>
.cta-card {
  display: block;
  border: 1px solid rgb(229 231 235);
  border-radius: 8px;
  padding: 12px 14px;
  background: white;
  transition: background 0.15s, border-color 0.15s;
}

.cta-card:hover {
  background: rgb(249 250 251);
  border-color: rgb(209 213 219);
}

.cta-avatar {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgb(239 68 68);
  color: white;
  flex-shrink: 0;
}
</style>
