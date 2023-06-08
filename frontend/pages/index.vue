<script setup lang="ts">
const dayjs = useDayjs()

const zkStore = useZkStore()
const { merkleProof } = storeToRefs(zkStore)

const createDialog = ref(false)

const postStore = usePostStore()
const { lastUpdated } = storeToRefs(postStore)

const order = ref<'time' | 'vote'>('vote')
const posts = computed(() => {
  const ordered = [...postStore.posts]
  if (order.value === 'time') {
    ordered.sort((a, b) => b.createdAt - a.createdAt)
  } else if (order.value === 'vote') {
    ordered.sort((a, b) => b.voteCount - a.voteCount)
  }
  return ordered
})

const currentPostId = ref<string | null>(null)
const currentPost = computed(() => postStore.getPost(currentPostId.value))

postStore.updatePosts()
onMounted(() => {
  const interval = setInterval(() => postStore.updatePosts(), 1000 * 60)
  onUnmounted(() => clearInterval(interval))
})
</script>

<template>
  <div class="box">
    <v-btn-toggle class="order" v-model="order" borderless density="compact">
      <v-btn value="vote"> Vote </v-btn>
      <v-btn value="time"> Time </v-btn>
    </v-btn-toggle>

    <div class="list">
      <v-list v-if="posts.length > 0" lines="two">
        <template v-for="post in posts" :key="post.id">
          <v-list-item
            :title="post.title"
            :subtitle="post.body"
            :active="currentPostId === post.id"
            @click="currentPostId = post.id"
          >
            <template v-slot:prepend>
              <v-avatar color="light-blue">
                {{ post.voteCount }}
              </v-avatar>
            </template>
            <template v-slot:append>
              <span class="text-caption">
                {{ dayjs(post.createdAt).toNow() }}
              </span>
            </template>
          </v-list-item>
          <v-divider />
        </template>
      </v-list>
      <div v-else class="h-100 d-flex justify-center align-center text-caption">
        No posts found
      </div>
    </div>

    <PostCard class="card" :post="currentPost" />

    <div class="actions">
      <v-btn v-if="!merkleProof" href="/register"> Register</v-btn>
      <v-btn v-else @click="createDialog = true"> Create Post</v-btn>
      <span class="text-caption">
        Last updated: {{ lastUpdated.toNow() }}
      </span>
    </div>
  </div>

  <v-dialog v-model="createDialog" width="auto" persistent>
    <PostForm @close="createDialog = false" />
  </v-dialog>
</template>

<style scoped lang="scss">
.box {
  max-height: 100%;
  width: 100%;

  display: grid;
  grid-template-rows: max-content minmax(0, 1fr) max-content;
  grid-template-columns: 320px 1fr;
  grid-template-areas:
    'order card'
    'list card'
    'actions card';
  gap: 2px 16px;

  .order {
    grid-area: order;
    width: 320px;
    > * {
      width: 50%;
    }
  }

  .list {
    grid-area: list;
    max-height: calc(100dvh - 104px - 40px);
    min-height: calc(100dvh - 104px - 40px);
    height: auto;
    width: 320px;
    overflow: scroll;
  }

  .card {
    grid-area: card;
    flex-grow: 1;
  }

  .actions {
    grid-area: actions;
    width: 320px;
    text-align: center;
    background-color: white;
    display: flex;
    flex-direction: column;
  }
}
</style>
