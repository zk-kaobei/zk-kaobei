<script setup lang="ts">
const dayjs = useDayjs()

const zkStore = useZkStore()
const { merkleProof } = storeToRefs(zkStore)

const createDialog = ref(false)

const postStore = usePostStore()
const { posts, lastUpdated } = storeToRefs(postStore)

const currentPost = ref<Post | null>(null)

postStore.updatePosts()
onMounted(() => {
  const interval = setInterval(() => postStore.updatePosts(), 1000 * 60)
  onUnmounted(() => clearInterval(interval))
})
</script>

<template>
  <div class="box">
    <div class="list">
      <v-list v-if="posts.length > 0" lines="two">
        <template v-for="post in posts" :key="post.id">
          <v-list-item
            :title="post.title"
            :subtitle="post.body"
            @click="currentPost = post"
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

    <v-card class="card">
      <template v-if="currentPost">
        <v-card-title>
          {{ currentPost.title }}
        </v-card-title>
        <v-card-text>
          <v-chip-group>
            <v-chip v-for="tag in currentPost.tags" :key="tag">
              {{ tag }}
            </v-chip>
          </v-chip-group>
          {{ currentPost.body }}
        </v-card-text>
        <v-btn class="close" variant="outlined" @click="currentPost = null">
          X
        </v-btn>
      </template>
      <template v-else>
        <v-card-text> No post selected </v-card-text>
      </template>
    </v-card>

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
  grid-template-rows: minmax(0, 1fr) max-content;
  grid-template-columns: 320px 1fr;
  grid-template-areas:
    'list card'
    'actions card';
  gap: 16px;

  // display: flex;
  // // flex-direction: column;
  // justify-content: center;
  // align-items: stretch;

  .list {
    grid-area: list;
    max-height: calc(100dvh - 104px);
    min-height: calc(100dvh - 104px);
    height: auto;
    width: 320px;
    overflow: scroll;
  }

  .card {
    grid-area: card;
    flex-grow: 1;
    position: relative;
    .close {
      position: absolute;
      top: 8px;
      right: 8px;
    }
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
