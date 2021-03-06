"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = exports.adminPostInput = void 0;
const core_1 = require("@mikro-orm/core");
const type_graphql_1 = require("type-graphql");
const MongoClass_1 = require("./MongoClass");
const User_1 = require("./User");
let adminPostInput = class adminPostInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], adminPostInput.prototype, "title", void 0);
adminPostInput = __decorate([
    (0, type_graphql_1.InputType)()
], adminPostInput);
exports.adminPostInput = adminPostInput;
let Post = class Post extends MongoClass_1.MongoClass {
};
__decorate([
    (0, type_graphql_1.Field)(),
    (0, core_1.Property)({ type: 'text' }),
    __metadata("design:type", String)
], Post.prototype, "title", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => User_1.User),
    (0, core_1.ManyToOne)(() => User_1.User),
    __metadata("design:type", User_1.User)
], Post.prototype, "creator", void 0);
Post = __decorate([
    (0, type_graphql_1.ObjectType)({ implements: MongoClass_1.MongoClass }),
    (0, core_1.Entity)()
], Post);
exports.Post = Post;
//# sourceMappingURL=Post.js.map