<script setup lang="ts">
const identity = useIdentity()

apiMerkleProof(identity.value)
    .then(({ success }) => {
        if (success) navigateTo('/posts')
        else navigateTo('/register', { replace: true })
    })

</script>

<template>
    <v-progress-circular indeterminate color="primary" />
</template>

<style scoped></style>
