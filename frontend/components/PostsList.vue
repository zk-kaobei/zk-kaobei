<script setup lang="ts">
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

    <v-card class="card" v-if="currentPost">
      <v-card-title>
        {{ currentPost.title }}
      </v-card-title>
      <v-card-text>
        {{ currentPost.body }}
      </v-card-text>
    </v-card>

    <span class="status text-caption">
      Last updated: {{ lastUpdated.toNow() }}
    </span>
  </div>
</template>

<style scoped lang="scss">
.box {
  height: 100%;
  width: 100%;
  position: relative;

  display: flex;
  // flex-direction: column;
  justify-content: center;
  align-items: stretch;

  .list {
    max-height: calc(100dvh - 32px);
    min-height: calc(100dvh - 32px);
    height: auto;
    width: 320px;
    overflow: scroll;
    padding-bottom: 32px;
  }

  .card {
    flex-grow: 1;
  }

  .status {
    width: 320px;
    text-align: center;
    position: absolute;
    bottom: 0px;
    left: 0px;
    padding: 4px;
    background-color: white;
  }
}
</style>
