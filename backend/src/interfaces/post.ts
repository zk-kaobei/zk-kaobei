import { FullProof } from "@semaphore-protocol/proof"


interface Post {
    id: number;
    title: string;
    body: string;
    tags: string[];
    externalNullifier: string;
}

interface PostData {
    title: string;
    body: string;
    tags: string[];
    proof: FullProof;
}

export { Post, PostData };