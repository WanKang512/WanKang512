import { Connection, EntityManager, IDatabaseDriver } from '@mikro-orm/core';
import { Session, SessionData } from 'express-session';
import { Redis } from 'ioredis';
export declare type Mycontext = {
    em: EntityManager<IDatabaseDriver<Connection>>;
    req: Request & {
        session: Session & Partial<SessionData> & {
            userId: string | undefined;
            phoneCode: string;
        };
    };
    res: Response;
    redis: Redis;
};
declare const EntityName: readonly ["Post", "User", "Order"];
export declare type EntityName = typeof EntityName[number];
declare const _default: import("@mikro-orm/core").Configuration<IDatabaseDriver<Connection>> | import("@mikro-orm/core").Options<IDatabaseDriver<Connection>> | undefined;
export default _default;
