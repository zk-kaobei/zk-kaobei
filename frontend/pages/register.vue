<script setup lang="ts">
const route = useRoute()
const code = ref((route.query.code as string | undefined) ?? null)
const loading = ref('')

const { clientId } = useRuntimeConfig().public
const zkStore = useZkStore()

const oauthCallbackURL = computed(() => {
  const url = new URL('https://id.nycu.edu.tw/o/authorize/')
  url.searchParams.set('client_id', clientId)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('scope', 'profile')
  url.searchParams.set('redirect_uri', location.href)
  return url.toString()
})

onMounted(async () => {
  if (code.value) {
    loading.value = 'Registering identity...'
    const { success, message } = await zkStore.registerIdentity(code.value)
    if (success) {
      navigateTo('/')
    } else {
      alert(message)
    }
    loading.value = ''
  }
})
</script>

<template>
  <template v-if="loading">
    <v-progress-circular indeterminate color="primary" />
    <br />
    <span class="text-caption">
      {{ loading }}
    </span>
  </template>
  <template v-else>
    <v-img max-height="200" src="/nycu-seal.png" />
    <v-btn
      color="primary"
      :href="oauthCallbackURL"
      text="Login with NYCU OAuth"
    />
  </template>
</template>

<style scoped></style>
