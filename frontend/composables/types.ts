interface Post {
  id: string
  title: string
  body: string
  tags: string[]
  externalNullfier: BigInt
  createdAt: number
  voteCount: number
}

interface PostInfo {
  title: string
  body: string
  tags: string[]
}
