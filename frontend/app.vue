<script setup lang="ts">
declare global {
  interface BigInt {
    toJSON(): string
  }
}
BigInt.prototype.toJSON = function (): string {
  return this.toString() + 'n'
}

const zkStore = useZkStore()
zkStore.getMerkleProof()
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
