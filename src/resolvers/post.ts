import {
	Arg,
	Ctx,
	FieldResolver,
	Mutation,
	Query,
	Resolver,
	Root,
} from 'type-graphql'
import { Post } from '../entities/Post'
import { User } from '../entities/User'
import { Mycontext } from '../mikro-orm.config'

@Resolver(Post)
export class PostResolver {
	@FieldResolver(() => User)
	async creator(@Root() post: Post, @Ctx() { em }: Mycontext) {
		const user = await em.findOne(User, { id: post.creator.id })
		return user
	}

	// @Query(() => [Post])
	// posts(
	// 	@Ctx() { em }: Mycontext,
	// 	@Arg('limit', () => Int, { nullable: true }) limit?: number,
	// 	@Arg('offset', () => Int, { nullable: true }) offset?: number
	// ) {
	// 	return usePagination(em, 'Post', {}, limit, offset)
	// }

	@Query(() => Post, { nullable: true })
	post(
		@Ctx() { em }: Mycontext,
		@Arg('id', () => String) id: string
	): Promise<Post | null> {
		const post = em.findOne(Post, { id })
		return post
	}

	@Mutation(() => Post, { nullable: true })
	async createPost(
		@Ctx() { em }: Mycontext,
		@Arg('title', () => String) title: string
	): Promise<Post> {
		const post = em.create(Post, { title })
		await em.persistAndFlush(post)
		return post
	}
}
