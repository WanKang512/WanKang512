import { Post } from '../entities/Post';
import { User } from '../entities/User';
import { Mycontext } from '../mikro-orm.config';
export declare class PostResolver {
    creator(post: Post, { em }: Mycontext): Promise<User | null>;
    post({ em }: Mycontext, id: string): Promise<Post | null>;
    createPost({ em }: Mycontext, title: string): Promise<Post>;
}
