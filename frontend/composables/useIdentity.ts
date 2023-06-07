import { Identity } from '@semaphore-protocol/identity'

export function useIdentity() {
    return useLocalStorage('identity', new Identity(), {
        serializer: {
          read: (v: string) => new Identity(v),
          write: (v: Identity) => v.toString(),
        },
      })
}
