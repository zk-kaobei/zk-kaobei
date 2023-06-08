<script setup lang="ts">
const dayjs = useDayjs()

interface Props {
  post: Post | null
}
const props = defineProps<Props>()

const zkStore = useZkStore()
const postStore = usePostStore()

const loading = ref(false)

async function vote(vote: boolean) {
  if (!zkStore.identity || !zkStore.merkleProof || !props.post)
    return navigateTo('/')
  loading.value = true
  await postStore.votePost(
    zkStore.identity,
    zkStore.merkleProof,
    props.post,
    vote,
  )
  loading.value = false
}
</script>

<template>
  <v-card class="card" :loading="loading">
    <template v-if="!props.post">
      <v-card-text> No post selected </v-card-text>
    </template>
    <template v-else>
      <v-card-title>
        {{ props.post.title }}
        <span class="text-caption">
          {{ dayjs(props.post.createdAt).toNow() }}
        </span>
      </v-card-title>
      <v-chip-group class="mx-4">
        <v-chip v-for="tag in props.post.tags" :key="tag">
          {{ tag }}
        </v-chip>
      </v-chip-group>
      <v-card-text class="body">
        {{ props.post.body }}
      </v-card-text>
      <v-btn-toggle :disabled="loading">
        <v-btn @click="vote(false)">
          <v-icon>mdi-minus</v-icon>
        </v-btn>
        <v-btn variant="text">
          {{ props.post.voteCount }}
        </v-btn>
        <v-btn @click="vote(true)">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-btn-toggle>
    </template>
  </v-card>
</template>

<style scoped lang="scss">
.card {
  max-height: calc(100dvh - 32px);
  .body {
    max-height: calc(100dvh - 32px - 64px - 32px - 48px);
    overflow: scroll;
  }
}
</style>
