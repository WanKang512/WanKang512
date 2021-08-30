import {
	Arg,
	ClassType,
	Ctx,
	Int,
	Mutation,
	Query,
	Resolver,
	UseMiddleware,
} from 'type-graphql'
import { Middleware } from 'type-graphql/dist/interfaces/Middleware'
import { MongoClass } from '../entities/MongoClass'
import { Mycontext } from '../mikro-orm.config'
import { adminPostInput, Post } from './../entities/Post'
import { adminProductInput, Product } from './../entities/Product'
import { adminUserInput, User } from './../entities/User'
import { isAuth } from './../middleware/isAuth'
import { EntityName } from './../mikro-orm.config'
import { usePagination } from './../utls/pagination'

const createAdminResolver = <T extends ClassType, X extends ClassType>(
	suffix: string,
	returnType: T,
	inputType: X,
	entityName: EntityName,
	middleware?: Middleware<Mycontext>[],
	creatorKeyName?: string
): any => {
	@Resolver()
	class BaseResolver {
		@Mutation(() => returnType, { name: `adminCreate${suffix}` })
		@UseMiddleware(...(middleware || []))
		async create(
			@Ctx() { em, req }: Mycontext,
			@Arg('data', () => inputType) data: X
		) {
			let item: any
			if (creatorKeyName !== undefined) {
				item = em.create(entityName, {
					...data,
					[creatorKeyName]: req.session.userId,
				})
			} else {
				item = em.create(entityName, {
					...data,
				})
			}
			await em.persistAndFlush(item)
			return item
		}

		@Query(() => [returnType], { name: `admin${suffix}s` })
		@UseMiddleware(...(middleware || []))
		async items(
			@Ctx() { em }: Mycontext,
			@Arg('limit', () => Int, { nullable: true }) limit?: number,
			@Arg('offset', () => Int, { nullable: true }) offset?: number
		) {
			return usePagination(em, entityName, {}, limit, offset)
		}

		@Query(() => returnType, { name: `admin${suffix}` })
		@UseMiddleware(...(middleware || []))
		async item(@Ctx() { em }: Mycontext, @Arg('id') id: string) {
			return em.findOne(entityName, { id })
		}

		@Mutation(() => Number, { name: `adminUpdate${suffix}` })
		@UseMiddleware(...(middleware || []))
		async updateItem(
			@Ctx() { em }: Mycontext,
			@Arg('id') id: string,
			@Arg('data', () => inputType) data: X
		) {
			const result = await em
				.getRepository<MongoClass>(entityName)
				.nativeUpdate({ id }, data)

			return result
		}

		@Mutation(() => Number, { name: `adminDelete${suffix}` })
		@UseMiddleware(...(middleware || []))
		async deleteItem(@Ctx() { em }: Mycontext, @Arg('id') id: string) {
			const result = await em
				.getRepository<MongoClass>(entityName)
				.nativeDelete({ id })

			return result
		}
	}
	return BaseResolver
}

const adminPostResolver = createAdminResolver(
	'post',
	Post,
	adminPostInput,
	'Post',
	[isAuth('USER')],
	'creator'
)

const adminUserResolver = createAdminResolver('user', User, adminUserInput, 'User', [
	isAuth('USER'),
])

const adminProductResolver = createAdminResolver(
	'product',
	Product,
	adminProductInput,
	'Product',
	[isAuth('USER')]
)

export const adminResolvers = [
	adminPostResolver,
	adminUserResolver,
	adminProductResolver,
]
