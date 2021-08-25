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
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const type_graphql_1 = require("type-graphql");
const Post_1 = require("./entities/Post");
const hello_1 = require("./resolvers/hello");
const post_1 = require("./resolvers/post");
dotenv_1.default.config({ path: path_1.default.join(__dirname, '..', '.env') });
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = express_1.default();
    const orm = yield core_1.MikroORM.init({
        entities: [Post_1.Post],
        type: 'mongo',
        clientUrl: process.env.MONGODB,
        debug: true,
    });
    app.use(cors_1.default({
        origin: 'http://localhost:3000',
        credentials: true,
    }));
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: yield type_graphql_1.buildSchema({
            resolvers: [post_1.PostResolver, hello_1.HelloResolver],
            validate: false,
        }),
        context: ({ req, res }) => ({ em: orm.em, req, res }),
    });
    apolloServer.applyMiddleware({ app, cors: false });
    app.listen(3004, () => {
        console.log(233333);
    });
    console.log(123);
    const createData = orm.em.create(Post_1.Post, { title: 'Wan' });
    yield orm.em.persistAndFlush(createData);
    const posts = yield orm.em.find(Post_1.Post, {});
    console.log(posts);
});
main();
//# sourceMappingURL=index1.js.map