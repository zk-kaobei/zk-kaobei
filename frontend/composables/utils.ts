import { generateProof } from '@semaphore-protocol/proof'
import { MerkleProof } from '@zk-kit/incremental-merkle-tree'
import { Identity } from '@semaphore-protocol/identity'
import { keccak256 } from '@ethersproject/keccak256'

export async function makeFullProof(
  identity: Readonly<Identity>,
  merkleProof: MerkleProof,
  externalNullifier: string | BigInt,
  data: any,
) {
  if (typeof externalNullifier === 'string')
    externalNullifier = keccak256(Buffer.from(externalNullifier))
  const fullProof = await generateProof(
    // @ts-ignore
    identity,
    merkleProof,
    externalNullifier,
    keccak256(Buffer.from(JSON.stringify(data))),
  )

  return fullProof
}
