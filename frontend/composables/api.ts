import { Identity } from '@semaphore-protocol/identity'

export function apiFetch(method: 'GET' | 'POST', path: string, body: any) {
  return fetch(`/api${path}`, {
    method,
    body: JSON.stringify(body),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then(async (resp) => ({
      ...(await resp.json()),
      success: resp.ok,
    }))
    .catch((err) => {
      console.error(err)
      return {
        success: false,
        message: 'Unknown error',
      }
    })
}

export function apiRegister(identity: Identity, oAuthToken: string) {
  return apiFetch('POST', '/register', {
    identityCommitment: identity.commitment.toString(),
    oAuthToken,
  })
}

export function apiMerkleProof(identity: Identity) {
  return apiFetch('POST', '/merkleproof', {
    identityCommitment: identity.commitment.toString(),
  })
}

export function apiPost(title: string, body: string, tags: string[]) {
  return apiFetch('POST', '/post', {
    title,
    body,
    tags,
  })
}

export function apiPosts() {
  return apiFetch('GET', '/posts', {})
}

export function apiVote(id: string, vote: number) {
  return apiFetch('POST', `/vote/${id}`, {
    vote,
  })
}
