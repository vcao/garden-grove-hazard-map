import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    news: defineCollection({
      type: 'page',
      source: {
        include: 'news/**/*.md'
      },
      schema: z.object({
        date: z.string(),
        title: z.string(),
        summary: z.string().optional()
      })
    }),
    mma: defineCollection({
      type: 'page',
      source: {
        include: 'mma-info.md'
      }
    })
  }
})
