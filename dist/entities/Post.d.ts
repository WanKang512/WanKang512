import { MongoClass } from './MongoClass';
import { User } from './User';
export declare class adminPostInput {
    title: string;
}
export declare class Post extends MongoClass {
    title: string;
    creator: User;
}
