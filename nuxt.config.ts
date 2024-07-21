export default defineNuxtConfig({
  devtools: { enabled: false },
  css: ['@/assets/style/index.less', 'animate.css/animate.css','hover.css/less/hover.less'],

  typescript: {
    shim: false
  },

  modules: [
    'nuxt-windicss',
    '@pinia/nuxt',
    '@element-plus/nuxt',
    '@nuxtjs/i18n'
  ],

  i18n: {
    vueI18n: './i18n.config.ts'
  },

  build: {
    transpile: ['echarts']
  },

  plugins: [
    { src: '~/plugins/gtag.client.ts', mode: 'client' }
  ],

  elementPlus: { themes: ['dark'] },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title: 'Lumoz | OP Bridge',
      meta: [
        { charset: 'utf-8' },
        {
          hid: 'keywords',
          name: 'keywords',
          content:
            ''
        },
        {
          hid: 'description',
          name: 'description',
          content: ''
        }
      ]
    }
  },

  compatibilityDate: '2024-07-21'
})