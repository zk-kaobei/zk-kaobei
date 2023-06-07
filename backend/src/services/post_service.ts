import { Post } from "../interfaces/post";


export class PostService {
    private static _instance: PostService;
    postStorage: Map<bigint, Post> = new Map();

    constructor() {
    }

    async loadPostsFromStorage(): Promise<void> {
    }

    /**
     * Add a new post to the storage, indexed by the post id
     * @param postId 
     * @param post 
     */
    async addPost(postId: bigint, post: Post): Promise<void> {
        this.postStorage.set(postId, post);
    }

    /**
     * 
     * @returns all posts in the storage
     */
    async getPosts(): Promise<Post[]> {
        return [...this.postStorage.values()];
    }

    /**
     * 
     * @param postId 
     * @returns 
     */
    async getPost(postId: bigint): Promise<Post | undefined> {
        return this.postStorage.get(postId);
    }

    /**
     * Get the singleton instance of the service
     */
    public static get Instance() {
        // Do you need arguments? Make it a regular static method instead.
        return this._instance || (this._instance = new this());
    }
}