<script setup lang="ts">
const route = useRoute()
const code = route.query.code as string

const { clientId } = useRuntimeConfig().public
const identity = useIdentity()

const oauthCallbackURL = computed(() => {
  const url = new URL('https://id.nycu.edu.tw/o/authorize/')
  url.searchParams.set('client_id', clientId)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('scope', 'profile')
  url.searchParams.set('redirect_uri', location.href)
  return url.toString()
})

if (code) {
  ;(async () => {
    const { success, message } = await apiRegister(identity.value, code)
    console.log({ success, message })
    if (success) navigateTo('/posts')
  })()
}
</script>

<template>
  <template v-if="!code">
    <v-img max-height="200" src="/nycu-seal.png" />
    <v-btn
      color="primary"
      :href="oauthCallbackURL"
      text="Login with NYCU OAuth"
    />
  </template>
  <template v-else>
    {{ code }}
  </template>
</template>

<style scoped></style>
