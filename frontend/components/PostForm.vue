<script setup lang="ts">
const title = ref('')
const body = ref('')
const tags = ref([])

async function submit() {
  console.log(title.value, body.value, tags.value)
  const fullProof = {} as any // TODO
  const resp = await apiPost(title.value, body.value, tags.value, fullProof)
}
</script>

<template>
  <v-card class="mx-auto" max-width="344" variant="outlined">
    <v-card-title> Create Post </v-card-title>

    <v-card-item>
      <v-text-field
        class="pt-2"
        v-model="title"
        label="Title"
        variant="outlined"
      />
      <v-textarea v-model="body" label="Body" variant="outlined" />
    </v-card-item>

    <v-card-actions>
      <v-btn variant="outlined" @click="submit"> Submit </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped></style>
