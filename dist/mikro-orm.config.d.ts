import { Connection, EntityManager, IDatabaseDriver } from '@mikro-orm/core';
import { Request, Response } from 'express';
import { Session, SessionData } from 'express-session';
import { Redis } from 'ioredis';
import { Order } from './entities/Order';
import { Post } from './entities/Post';
import { Product } from './entities/Product';
import { User } from './entities/User';
export declare type Mycontext = {
    em: EntityManager<IDatabaseDriver<Connection>>;
    req: Request & {
        session: Session & Partial<SessionData> & {
            userId: string | undefined;
            role: string;
        };
    };
    res: Response;
    redis: Redis;
};
export declare const entities: (typeof Post | typeof User | typeof Order | typeof Product)[];
declare const EntityName: readonly ["Post", "User", "Order", "Product"];
export declare type Items = typeof entities[number];
export declare type ItemInstance = InstanceType<Items>;
export declare type EntityName = typeof EntityName[number];
declare const _default: import("@mikro-orm/core").Options<IDatabaseDriver<Connection>> | import("@mikro-orm/core").Configuration<IDatabaseDriver<Connection>> | undefined;
export default _default;
