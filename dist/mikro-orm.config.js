"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.entities = void 0;
const mongo_highlighter_1 = require("@mikro-orm/mongo-highlighter");
const reflection_1 = require("@mikro-orm/reflection");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const Order_1 = require("./entities/Order");
const Post_1 = require("./entities/Post");
const Product_1 = require("./entities/Product");
const User_1 = require("./entities/User");
dotenv_1.default.config({ path: path_1.default.join(__dirname, '..', '.env') });
exports.entities = [Post_1.Post, User_1.User, Order_1.Order, Product_1.Product];
const EntityName = ['Post', 'User', 'Order', 'Product'];
exports.default = {
    metadataProvider: reflection_1.TsMorphMetadataProvider,
    type: 'mongo',
    ClientUrl: process.env.MONGODB,
    entities: exports.entities,
    highlighter: new mongo_highlighter_1.MongoHighlighter(),
    debug: process.env.NODE_ENV === 'development',
};
//# sourceMappingURL=mikro-orm.config.js.map