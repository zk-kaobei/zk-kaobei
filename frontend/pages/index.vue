<script setup lang="ts">
const zkStore = useZkStore()
const { identity, merkleProof } = storeToRefs(zkStore)

const postStore = usePostStore()
const { posts, lastUpdated } = storeToRefs(postStore)

const currentPost = ref<Post | null>(null)

currentPost.value = posts.value[0]

// poststore.updatePosts()
// onMounted(() => {
//   const interval = setInterval(updatePosts, 1000 * 60)
//   onUnmounted(() => clearInterval(interval))
// })
</script>

<template>
  <div class="box">
    <v-list class="list" lines="two">
      <template v-for="post in posts" :key="post.id">
        <v-list-item
          :title="post.title"
          :subtitle="post.body"
          @click="currentPost = post"
        />
        <v-divider />
      </template>
    </v-list>

    <v-card class="card">
      <template v-if="currentPost">
        <v-card-title>
          {{ currentPost.title }}
        </v-card-title>
        <v-card-text>
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
      <v-btn v-else @click=""> Create Post</v-btn>
      <span class="text-caption">
        Last updated: {{ lastUpdated.toNow() }}
      </span>
    </div>
  </div>
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
