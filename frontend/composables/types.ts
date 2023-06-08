interface Post {
  id: string
  title: string
  body: string
  tags: string[]
  externalNullifier: BigInt
  createdAt: number
  voteCount: number
}

interface PostInfo {
  title: string
  body: string
  tags: string[]
}

interface VoteInfo {
  postId: string
  vote: boolean
}
