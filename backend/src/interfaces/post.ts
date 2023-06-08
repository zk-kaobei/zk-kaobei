import { FullProof } from "@semaphore-protocol/proof"


interface Post {
    id: string;
    title: string;
    body: string;
    tags: string[];
    externalNullifier: bigint;
    createdAt: number;
    voteCount: number;
}

interface PostData {
    title: string;
    body: string;
    tags: string[];
    proof: FullProof;
}

export { Post, PostData };