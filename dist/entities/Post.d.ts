import { MongoClass } from './MongoClass';
import { User } from './User';
export declare class adminUserInput {
    title: string;
}
export declare class Post extends MongoClass {
    title: string;
    creator: User;
}
