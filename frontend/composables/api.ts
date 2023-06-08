import { FullProof } from '@semaphore-protocol/proof'

export function JSONparseBigInt(text: string) {
  return JSON.parse(text, (key, value) => {
    if (typeof value === 'string' && value.match(/^[0-9]+n$/))
      return BigInt(value.slice(0, -1))
    return value
  })
}

export function apiFetch(
  method: 'GET' | 'POST',
  path: string,
  body: any = null,
  skipMessage = false,
) {
  const options: Record<string, any> = {
    method,
    headers: {
      Accept: 'application/json',
    },
  }
  if (method === 'POST') {
    options.headers['Content-Type'] = 'application/json'
    options.body = JSON.stringify(body)
  }
  return fetch(`/api${path}`, options)
    .then(async (resp) => {
      const text = await resp.text()
      const success = resp.ok
      const data = JSONparseBigInt(text)
      if (!skipMessage && (data.message || !success)) {
        useMessageStore().message = data.message ?? 'Unknown error'
      }
      return { success, ...data }
    })
    .catch((err) => {
      console.error(err)
      return {
        success: false,
        message: 'Unknown error',
      }
    })
}

export function apiRegister(identityCommitment: BigInt, oAuthToken: string) {
  return apiFetch('POST', '/register', {
    identityCommitment,
    oAuthToken,
  })
}

export function apiMerkleProof(identityCommitment: BigInt) {
  return apiFetch('POST', '/merkleproof', {
    identityCommitment,
  }, true)
}

export function apiPost(
  postInfo: PostInfo,
  fullProof: FullProof,
) {
  return apiFetch('POST', '/post', {
    ...postInfo,
    fullProof,
  })
}

export function apiPosts() {
  return apiFetch('GET', '/posts')
}

export function apiVote(id: string, vote: number) {
  return apiFetch('POST', `/vote/${id}`, {
    vote,
  })
}
