import { generateProof } from '@semaphore-protocol/proof'
import { MerkleProof } from '@zk-kit/incremental-merkle-tree'
import { Identity } from '@semaphore-protocol/identity'
import { keccak256 } from '@ethersproject/keccak256'

export const usePostStore = defineStore('poststore', () => {
  const dayjs = useDayjs()

  const lastUpdated = ref(dayjs())
  const posts = ref<Post[]>([])

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
    const signal = keccak256(Buffer.from(JSON.stringify(postInfo)))
    const externalNullifier = keccak256(Buffer.from('3.1416'))
    const fullProof = await generateProof(
      // @ts-ignore
      identity,
      merkleProof,
      externalNullifier,
      signal,
    )
    const result = await apiPost(postInfo, fullProof)
    if (result.success) updatePosts()
    return result
  }

  return {
    lastUpdated,
    posts,
    updatePosts,
    createPost,
  }
})
