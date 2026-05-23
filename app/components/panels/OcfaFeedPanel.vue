<script setup lang="ts">
const containerRef = ref<HTMLDivElement | null>(null)

const TWITTER_SCRIPT_ID = 'twitter-widgets-script'
const TWITTER_SCRIPT_SRC = 'https://platform.twitter.com/widgets.js'

declare global {
  interface Window {
    twttr?: {
      ready: (cb: (twttr: { widgets: { load: (el?: HTMLElement) => void } }) => void) => void
      widgets: { load: (el?: HTMLElement) => void }
    }
  }
}

function ensureScript(): Promise<void> {
  return new Promise((resolve) => {
    if (window.twttr) return resolve()
    const existing = document.getElementById(TWITTER_SCRIPT_ID) as HTMLScriptElement | null
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true })
      return
    }
    const s = document.createElement('script')
    s.id = TWITTER_SCRIPT_ID
    s.src = TWITTER_SCRIPT_SRC
    s.async = true
    s.charset = 'utf-8'
    s.addEventListener('load', () => resolve(), { once: true })
    document.head.appendChild(s)
  })
}

onMounted(async () => {
  await ensureScript()
  if (!window.twttr) return
  window.twttr.ready((twttr) => {
    if (!containerRef.value) return
    twttr.widgets.load(containerRef.value)
  })
})
</script>

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
            <span class="font-semibold text-sm">Orange County Fire Authority</span>
            <UIcon name="i-lucide-external-link" class="size-3 text-gray-400" />
          </div>
          <div class="text-xs text-gray-500">@OCFireAuthority</div>
          <div class="text-xs text-gray-600 dark:text-gray-400 mt-1.5 leading-snug">
            Live incident updates, evacuation orders, and shelter information. Open on X.com for the latest posts.
          </div>
        </div>
      </div>
    </a>

    <p class="text-[11px] text-gray-500 px-1">
      Inline timeline below (where available):
    </p>

    <div ref="containerRef" class="twitter-embed">
      <a
        class="twitter-timeline"
        data-height="500"
        data-theme="light"
        data-chrome="noheader nofooter noborders transparent"
        href="https://twitter.com/OCFireAuthority?ref_src=twsrc%5Etfw"
      >Tweets by @OCFireAuthority</a>
    </div>
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

:global(.dark) .cta-card {
  background: rgb(17 24 39);
  border-color: rgb(31 41 55);
}

:global(.dark) .cta-card:hover {
  background: rgb(31 41 55);
  border-color: rgb(55 65 81);
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

.twitter-embed {
  min-height: 60px;
}
</style>
