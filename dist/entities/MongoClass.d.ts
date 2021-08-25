import { ObjectId } from '@mikro-orm/mongodb';
export declare abstract class MongoClass {
    readonly _id: ObjectId;
    id: string;
    createAt: Date;
    updateAt: Date;
}
