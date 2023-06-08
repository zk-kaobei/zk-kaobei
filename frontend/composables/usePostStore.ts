import { generateProof } from '@semaphore-protocol/proof'
import { MerkleProof } from '@zk-kit/incremental-merkle-tree'
import { Identity } from '@semaphore-protocol/identity'
import { keccak256 } from '@ethersproject/keccak256'

export const usePostStore = defineStore('poststore', () => {
  const dayjs = useDayjs()

  const lastUpdated = ref(dayjs())
  const posts = ref<Post[]>([])
  const postMap = computed(() => {
    const map = new Map<string, Post>()
    posts.value.forEach((post) => map.set(post.id, post))
    return map
  })

  function getPost(id: string | null) {
    if (!id) return null
    return postMap.value.get(id) ?? null
  }

  async function updatePosts() {
    const data = await apiPosts()
    posts.value = data.posts
    lastUpdated.value = dayjs()
  }

  async function createPost(
    identity: Readonly<Identity>,
    merkleProof: MerkleProof,
    postInfo: PostInfo,
  ) {
    const fullProof = await makeFullProof(
      identity,
      merkleProof,
      '3.1416',
      postInfo,
    )
    const result = await apiPost(postInfo, fullProof)
    if (result.success) updatePosts()
    return result
  }

  async function votePost(
    identity: Readonly<Identity>,
    merkleProof: MerkleProof,
    post: Post,
    vote: boolean,
  ) {
    const data: VoteInfo = {
      postId: post.id,
      vote,
    }
    const fullProof = await makeFullProof(
      identity,
      merkleProof,
      post.externalNullifier,
      data,
    )
    const result = await apiVote(data, fullProof)
    if (result.success) updatePosts()
    return result
  }

  return {
    lastUpdated,
    posts,
    getPost,
    updatePosts,
    createPost,
    votePost,
  }
})
