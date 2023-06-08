import { Post } from '../interfaces/post';


export class PostService {
    private static _instance: PostService;
    postStorage: Map<string, Post>;
    nullifiers: Map<BigInt, boolean>;

    constructor() {
        this.postStorage = new Map<string, Post>();
        this.nullifiers = new Map<BigInt, boolean>();
    }

    /**
     * Load posts from storage
     * @note Not implemented
     */
    async loadPostsFromStorage(): Promise<void> {
    }

    /**
     * Add a new post to the storage, indexed by the post id
     * @param postId 
     * @param post 
     */
    async addPost(postId: string, post: Post): Promise<void> {
        this.postStorage.set(postId, post);
    }

    /**
     * Update an old post in the storage, indexed by the post id
     * @param postId 
     * @param post 
     */
    async updatePost(postId: string, post: Post): Promise<void> {
        this.postStorage.set(postId, post);
    }

    /**
     * 
     * @returns all posts in the storage
     */
    async getPosts(): Promise<Post[]> {
        return [...this.postStorage.values()];
    }

    async addVote(postId: string, upvote: boolean): Promise<void> {
        const post: Post | undefined = await this.getPost(postId);
        if (!post) {
            throw new Error('Post not found');
        }
        
        if (upvote) {
            post.voteCount++;
        } else {
            post.voteCount--;
        }
        await this.updatePost(postId, post);
    }

    /**
     * Testing function to get the storage
     * @returns the storage
     */
    async _getStorage(): Promise<Map<string, Post>> {
        return this.postStorage;
    }

    /**
     * 
     * @param postId 
     * @returns 
     */
    async getPost(postId: string): Promise<Post | undefined> {
        return this.postStorage.get(postId);
    }

    /**
     * Nullify a identity
     * @param nullifier 
     */
    async nullify(nullifier: BigInt) {
        this.nullifiers.set(nullifier, true);
    }

    /**
     * Is a nullfiier already nullified?
     * @param nullifier 
     * @returns boolean
     */
    async alreadyNullified(nullifier: BigInt): Promise<boolean> {
        return this.nullifiers.has(nullifier);
    }

    /**
     * Get the singleton instance of the service
     */
    public static get Instance() {
        // Do you need arguments? Make it a regular static method instead.
        return this._instance || (this._instance = new this());
    }
}