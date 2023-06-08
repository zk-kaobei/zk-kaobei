<script setup lang="ts">
const emit = defineEmits(['close'])

const postStore = usePostStore()
const zkStore = useZkStore()

const title = ref('')
const body = ref('')
const tags = ref([])

const loading = ref(false)
const form = ref<null | HTMLFormElement>(null)

function close() {
  emit('close')
}

async function submit() {
  if (!zkStore.identity || !zkStore.merkleProof) return navigateTo('/')

  if (!form.value) return false
  const { valid } = await form.value.validate()
  if (!valid) return false

  const postInfo = {
    title: title.value,
    body: body.value,
    tags: tags.value,
  }
  loading.value = true
  const resp = await postStore.createPost(
    zkStore.identity,
    zkStore.merkleProof,
    postInfo,
  )
  loading.value = false
  if (resp.success) close()
}
</script>

<template>
  <v-card min-width="400px" :loading="loading">
    <v-card-title> Create Post </v-card-title>

    <v-card-item>
      <v-form ref="form" @submit.prevent class="form" :readonly="loading">
        <v-text-field
          class="pt-2"
          v-model="title"
          label="Title"
          variant="outlined"
          :rules="[(v) => !!v || 'Title is required']"
        />
        <v-textarea
          v-model="body"
          label="Body"
          variant="outlined"
          :rules="[(v) => !!v || 'Body is required']"
        />
        <v-combobox
          v-model="tags"
          label="Tags"
          multiple
          chips
          closable-chips
          outlined
          variant="outlined"
        />
      </v-form>

      <v-card-actions class="justify-space-evenly">
        <v-btn @click="close" :disabled="loading"> Close </v-btn>
        <v-btn type="submit" @click="submit" :disabled="loading">
          Submit
        </v-btn>
      </v-card-actions>
    </v-card-item>
  </v-card>
</template>

<style scoped lang="scss">
.form {
  * + * {
    margin-top: 8px;
  }
}
</style>
