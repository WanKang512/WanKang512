"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@mikro-orm/core");
const apollo_server_express_1 = require("apollo-server-express");
const connect_redis_1 = __importDefault(require("connect-redis"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const graphql_redis_subscriptions_1 = require("graphql-redis-subscriptions");
const ioredis_1 = __importDefault(require("ioredis"));
const path_1 = __importDefault(require("path"));
const type_graphql_1 = require("type-graphql");
const Order_1 = require("./entities/Order");
const Post_1 = require("./entities/Post");
const Product_1 = require("./entities/Product");
const User_1 = require("./entities/User");
const admin_1 = require("./resolvers/admin");
const hello_1 = require("./resolvers/hello");
const post_1 = require("./resolvers/post");
const profilePicture_1 = require("./resolvers/profilePicture");
const user_1 = require("./resolvers/user");
dotenv_1.default.config({ path: path_1.default.join(__dirname, '..', '.env') });
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    const orm = yield core_1.MikroORM.init({
        entities: [Post_1.Post, User_1.User, Order_1.Order, Product_1.Product],
        type: 'mongo',
        clientUrl: process.env.MONGODB,
        debug: true,
    });
    const RedisStore = (0, connect_redis_1.default)(express_session_1.default);
    const options = {
        host: process.env.REDIS_URL,
        password: process.env.REDIS_PASSWORD,
        retryStrategy: (times) => Math.max(times * 100, 3000),
    };
    const redis = new ioredis_1.default(process.env.REDIS_URL, options);
    const pubSub = new graphql_redis_subscriptions_1.RedisPubSub({
        publisher: new ioredis_1.default(process.env.REDIS_URL, options),
        subscriber: new ioredis_1.default(process.env.REDIS_URL, options),
    });
    app.set('trust proxy', 1);
    app.use((0, cors_1.default)({
        origin: process.env.MONGODB,
        credentials: true,
    }));
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: yield (0, type_graphql_1.buildSchema)({
            resolvers: [
                hello_1.HelloResolver,
                post_1.PostResolver,
                user_1.UserResolver,
                profilePicture_1.ProfilePictureResolver,
                ...admin_1.adminResolvers,
            ],
            validate: false,
            pubSub,
        }),
        context: ({ req, res }) => ({
            em: orm.em,
            req,
            res,
            redis,
        }),
    });
    app.use((0, express_session_1.default)({
        name: process.env.COOKIE_NAME,
        store: new RedisStore({ client: redis, disableTouch: true }),
        cookie: {
            maxAge: 1000 * 60 * 60 * parseInt(process.env.COOKIE_MAXAGE_HOURS),
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
        },
        secret: process.env.REDIS_SECRET,
        saveUninitialized: false,
        resave: false,
    }));
    apolloServer.applyMiddleware({ app, cors: false });
    const PORT = process.env.PORT || 8000;
    app.listen(PORT);
});
main();
//# sourceMappingURL=index.js.map