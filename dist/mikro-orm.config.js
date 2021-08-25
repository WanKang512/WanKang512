"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_highlighter_1 = require("@mikro-orm/mongo-highlighter");
const reflection_1 = require("@mikro-orm/reflection");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const Post_1 = require("./entities/Post");
dotenv_1.default.config({ path: path_1.default.join(__dirname, '..', '.env') });
exports.default = {
    metadataProvider: reflection_1.TsMorphMetadataProvider,
    type: 'mongo',
    ClientUrl: process.env.MONGODB,
    entitles: [Post_1.Post],
    highlighter: new mongo_highlighter_1.MongoHighlighter(),
    debug: process.env.NODE_ENV === 'development',
};
//# sourceMappingURL=mikro-orm.config.js.map