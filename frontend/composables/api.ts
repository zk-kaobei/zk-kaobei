import { Identity } from '@semaphore-protocol/identity'
import { Proof } from '@semaphore-protocol/proof'

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
  body: any,
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
    .then(async (resp) => ({
      text: await resp.text(),
      success: resp.ok,
    }))
    .then(({ text, success }) => ({
      success,
      ...JSONparseBigInt(text),
    }))
    .then((resp) => {
      if (!skipMessage && resp.message) {
        useMessageStore().message = resp.message
      }
      return resp
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
  title: string,
  body: string,
  tags: string[],
  fullProof: Proof,
) {
  return apiFetch('POST', '/post', {
    title,
    body,
    tags,
    fullProof,
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
