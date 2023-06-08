import { Identity } from '@semaphore-protocol/identity'
import { MerkleProof } from '@zk-kit/incremental-merkle-tree'

export const useZkStore = defineStore('zkStore', () => {
  const loading = ref(true)

  const identity = useLocalStorage('identity', new Identity(), {
    serializer: {
      read: (v: string) => new Identity(v),
      write: (v: Identity) => v.toString(),
    },
  })

  async function registerIdentity(code: string) {
    const { success, message } = await apiRegister(identity.value.commitment, code)
    if (success) {
      await getMerkleProof()
    }
    return { success, message }
  }

  const merkleProof = ref<MerkleProof | null>(null)

  async function getMerkleProof() {
    loading.value = true
    const resp = await apiMerkleProof(identity.value.commitment)
    loading.value = false
    if (!resp.success || !resp.merkleProof) {
      merkleProof.value = null
      return false
    } else {
      merkleProof.value = resp.merkleProof
      return true
    }
  }

  return {
    loading,
    identity,
    registerIdentity,
    merkleProof,
    getMerkleProof,
  }
})
