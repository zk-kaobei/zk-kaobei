const dotenv = require('dotenv')
dotenv.config({ path: '../.env' })

const apiProxyTarget = process.env.API_PROXY_TARGET || 'http://localhost:80'
const APP_NAME = process.env.APP_NAME || 'Semaphore Based Kao Bei Protocol'
const CLIENT_ID = process.env.CLIENT_ID || 'undefined'

console.log(process.env.CLIENT_ID)

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  modules: [
    [
      '@pinia/nuxt',
      {
        autoImports: ['defineStore', 'storeToRefs'],
      },
    ],
    '@vueuse/nuxt',
  ],
  runtimeConfig: {
    public: {
      appName: process.env.APP_NAME,
      clientId: CLIENT_ID,
    },
  },
  build: {
    transpile: ['vuetify'],
  },
  css: [
    'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.min.css',
  ],
  nitro: {
    prerender: {
      crawlLinks: false,
      routes: ['/'],
    },
    devProxy: {
      '/api': {
        target: `${apiProxyTarget}/api`,
        changeOrigin: true,
      },
    },
  },
  app: {
    head: {
      titleTemplate: '%s | ' + APP_NAME,
      viewport: 'width=device-width, initial-scale=1',
      charset: 'utf-8',
      htmlAttrs: {
        lang: 'zh-Hant-TW',
      },
      meta: [
        {
          name: 'application-name',
          content: process.env.APP_NAME,
        },
        {
          name: 'description',
          content: process.env.APP_NAME,
        },
        { 'http-equiv': 'x-ua-compatible', content: 'IE=edge' },
        {
          name: 'apple-mobile-web-app-title',
          content: process.env.APP_NAME,
        },
        {
          name: 'apple-mobile-web-app-title',
          content: process.env.APP_NAME,
        },
        { name: 'msapplication-TileColor', content: '#C37F49' },
        { name: 'theme-color', content: '#ffffff' },
      ],
    },
  },
})
