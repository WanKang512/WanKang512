import {
	Arg,
	Ctx,
	Field,
	FieldResolver,
	InputType,
	Int,
	ObjectType,
	Root,
} from 'type-graphql'
import { Post } from '../entities/Post'
import { User } from '../entities/User'
import { Mycontext } from '../mikro-orm.config'

@InputType()
class PhonePasswordInput {
	@Field()
	username: string
	@Field()
	password: string
}
@InputType()
class PhoneTokenInput {
	@Field()
	username: string
	@Field()
	token: string
}
@ObjectType()
export class FieldError {
	@Field()
	field: string
	@Field()
	message: string
}
@ObjectType()
export class UserResponse {
	@Field(() => [FieldError], { nullable: true })
	error?: FieldError[]
	@Field(() => User, { nullable: true })
	user?: User
	static createError(field: string, message: string) {
		return {
			user: undefined,
			errors: [
				{
					field,
					message,
				},
			],
		}
	}
}
@ObjectType()
export class UserResolver {
	@FieldResolver(() => [Post])
	async posts(
		@Root() user: User,
		@Ctx() { em }: Mycontext,
		@Arg('limit', () => Int, { nullable: true }) limit?: number,
		@Arg('offset', () => Int, { nullable: true }) offset?: number
	) {
		const posts = await usePagination(
			em,
			'Post',
			{ creator: user.id },
			limit,
			offset
		)
		return posts
	}
}
