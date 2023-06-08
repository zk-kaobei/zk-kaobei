export const usePostStore = defineStore('poststore', () => {
  const dayjs = useDayjs()

  const lastUpdated = ref(dayjs())
  const posts = ref<Post[]>([])

  for (let i = 0; i < 100; i++) {
    posts.value.push({
      id: i.toString(),
      title: `Post ${i}`,
      body: `This is post ${i}`,
      tags: [`tag${i}`, `tag${i + 1}`],
      externalNullfier: BigInt(i * 1234),
    })
  }

  async function updatePosts() {
    const { posts } = await apiPosts()
    posts.value = posts
    lastUpdated.value = dayjs()
  }

  return {
    lastUpdated,
    posts,
    updatePosts,
  }
})
