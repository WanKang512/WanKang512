import { Connection, EntityManager, IDatabaseDriver } from '@mikro-orm/core';
export declare type Mycontext = {
    em: EntityManager<IDatabaseDriver<Connection>>;
};
declare const _default: import("@mikro-orm/core").Options<IDatabaseDriver<Connection>> | import("@mikro-orm/core").Configuration<IDatabaseDriver<Connection>> | undefined;
export default _default;
