<script setup lang="ts">
const zkStore = useZkStore()
zkStore.getMerkleProof()
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
