import { Post } from '../entities/Post';
import { Mycontext } from '../mikro-orm.config';
export declare class PostResolver {
    posts({ em }: Mycontext): Promise<Post[]>;
    post({ em }: Mycontext, id: string): Promise<Post | null>;
    createPost({ em }: Mycontext, title: string): Promise<Post>;
}
