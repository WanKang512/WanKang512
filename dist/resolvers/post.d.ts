import { Post } from '../entities/Post';
import { User } from '../entities/User';
import { Mycontext } from '../mikro-orm.config';
export declare class PostResolver {
    creator(post: Post, { em }: Mycontext): Promise<User | null>;
    posts({ em }: Mycontext, limit?: number, offset?: number): Promise<import("@mikro-orm/core").AnyEntity<unknown>[]>;
    post({ em }: Mycontext, id: string): Promise<Post | null>;
    createPost({ em }: Mycontext, title: string): Promise<Post>;
    updatePost({ em }: Mycontext, id: string, title: string): Promise<Post | null>;
    deletePost({ em }: Mycontext, id: string): Promise<true>;
}
