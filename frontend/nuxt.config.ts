const dotenv = require('dotenv')
dotenv.config({ path: '../.env' })

const apiProxyTarget = process.env.API_PROXY_TARGET || 'http://localhost:80'
const APP_NAME = process.env.APP_NAME || 'Semaphore Based Kao Bei Protocol'
const CLIENT_ID = process.env.CLIENT_ID || 'undefined'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: false,
  modules: [
    [
      '@pinia/nuxt',
      {
        autoImports: ['defineStore', 'storeToRefs'],
      },
    ],
    '@vueuse/nuxt',
    'dayjs-nuxt',
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
      titleTemplate: APP_NAME,
      viewport: 'width=device-width, initial-scale=1',
      charset: 'utf-8',
      htmlAttrs: {
        lang: 'en',
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
      link: [
        {
          rel: 'shortcut icon',
          href: 'favicon.ico',
        },
        {
          rel: 'icon',
          type: 'image/x-icon',
          sizes: '16x16 32x32',
          href: 'favicon.ico',
        },
        {
          rel: 'apple-touch-icon',
          sizes: '152x152',
          href: 'favicon-152-precomposed.png',
        },
        {
          rel: 'apple-touch-icon',
          sizes: '120x120',
          href: 'favicon-120-precomposed.png',
        },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: 'favicon-180-precomposed.png',
        },
        {
          rel: 'manifest',
          href: 'manifest.json',
        },
        {
          rel: 'icon',
          sizes: '192x192',
          href: 'favicon-192.png',
        },
      ],
    },
  },
  dayjs: {
    locales: ['en'],
    plugins: ['relativeTime', 'utc', 'timezone'],
    defaultLocale: 'en',
    defaultTimezone: 'Asia/Taipei',
  },
})
