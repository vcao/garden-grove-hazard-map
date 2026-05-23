// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/content'
  ],

  devtools: {
    enabled: true
  },

  components: [
    { path: '~/components', pathPrefix: false }
  ],

  css: ['~/assets/css/main.css'],

  compatibilityDate: '2026-05-22',

  nitro: {
    preset: 'static',
    prerender: {
      routes: ['/'],
      crawlLinks: true
    }
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Garden Grove Hazard Map',
      titleTemplate: '%s',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Interactive blast, shrapnel, and toxic plume modeling for the May 2026 GKN Aerospace methyl methacrylate (MMA) incident in Garden Grove, CA. Live wind data, adjustable spill volume, and the official evacuation zone overlaid on a satellite map.' },
        { name: 'keywords', content: 'Garden Grove, GKN Aerospace, MMA, methyl methacrylate, hazard map, evacuation, blast radius, vapor cloud, plume, emergency, situational awareness, Orange County' },
        { name: 'author', content: 'Victor Cao' },
        { name: 'theme-color', content: '#020617' },
        { name: 'color-scheme', content: 'dark light' },

        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Garden Grove Hazard Map' },
        { property: 'og:title', content: 'Garden Grove Hazard Map' },
        { property: 'og:description', content: 'Interactive blast, shrapnel, and plume modeling for the May 2026 GKN Aerospace MMA incident in Garden Grove, CA.' },
        { property: 'og:url', content: 'https://garden-grove-hazard-map.pages.dev/' },
        { property: 'og:image', content: 'https://garden-grove-hazard-map.pages.dev/og-image.png' },
        { property: 'og:image:secure_url', content: 'https://garden-grove-hazard-map.pages.dev/og-image.png' },
        { property: 'og:image:type', content: 'image/png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: 'Garden Grove Hazard Map preview showing overpressure, shrapnel, and plume zones around the GKN Aerospace site.' },
        { property: 'og:locale', content: 'en_US' },

        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Garden Grove Hazard Map' },
        { name: 'twitter:description', content: 'Interactive blast, shrapnel, and plume modeling for the May 2026 GKN Aerospace MMA incident in Garden Grove, CA.' },
        { name: 'twitter:image', content: 'https://garden-grove-hazard-map.pages.dev/og-image.png' },
        { name: 'twitter:image:alt', content: 'Garden Grove Hazard Map preview showing overpressure, shrapnel, and plume zones around the GKN Aerospace site.' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'canonical', href: 'https://garden-grove-hazard-map.pages.dev/' }
      ]
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
