import {
	Arg,
	Ctx,
	FieldResolver,
	Int,
	Mutation,
	Query,
	Resolver,
	Root,
	UseMiddleware,
} from 'type-graphql'
import { Post } from '../entities/Post'
import { User } from '../entities/User'
import { isAuth } from '../middleware/isAuth'
import { Mycontext } from '../mikro-orm.config'
import { usePagination } from '../utls/pagination'

@Resolver(Post)
export class PostResolver {
	@FieldResolver(() => User)
	async creator(@Root() post: Post, @Ctx() { em }: Mycontext) {
		const user = await em.findOne(User, { id: post.creator.id })
		return user
	}

	@Query(() => [Post])
	posts(
		@Ctx() { em }: Mycontext,
		@Arg('limit', () => Int, { nullable: true }) limit?: number,
		@Arg('offset', () => Int, { nullable: true }) offset?: number
	) {
		return usePagination(em, 'Post', {}, limit, offset)
	}

	@Query(() => Post, { nullable: true })
	post(
		@Ctx() { em }: Mycontext,
		@Arg('id', () => String) id: string
	): Promise<Post | null> {
		const post = em.findOne(Post, { id })
		return post
	}

	@UseMiddleware(isAuth())
	@Mutation(() => Post, { nullable: true })
	async createPost(
		@Ctx() { em }: Mycontext,
		@Arg('title', () => String) title: string
	): Promise<Post> {
		const post = em.create(Post, { title })
		await em.persistAndFlush(post)
		return post
	}

	@Mutation(() => Post, { nullable: true })
	async updatePost(
		@Ctx() { em }: Mycontext,
		@Arg('id') id: string,
		@Arg('title', () => String, { nullable: true }) title: string
	): Promise<Post | null> {
		const post = await em.findOne(Post, { id })
		if (!post) {
			return null
		}
		post.title = title
		await em.persistAndFlush(post)
		return post
	}
	@Mutation(() => Boolean)
	async deletePost(@Ctx() { em }: Mycontext, @Arg('id') id: string): Promise<true> {
		await em.nativeDelete(Post, { id })
		return true
	}
}
