import bcrypt from 'bcryptjs'
import {
	Arg,
	Ctx,
	Field,
	FieldResolver,
	InputType,
	Int,
	Mutation,
	ObjectType,
	Query,
	Resolver,
	Root,
} from 'type-graphql'
import { Post } from '../entities/Post'
import { User } from '../entities/User'
import { Mycontext } from '../mikro-orm.config'
import { usePagination } from '../utls/pagination'
import { sendSMSToken } from '../utls/sendSms'
import { setAuth } from '../utls/setAuth'

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
			error: [
				{
					field,
					message,
				},
			],
		}
	}
}
@Resolver(User)
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
	@FieldResolver(() => [Post])
	async order(
		@Root() user: User,
		@Ctx() { em }: Mycontext,
		@Arg('limit', () => Int, { nullable: true }) limit?: number,
		@Arg('offset', () => Int, { nullable: true }) offset?: number
	) {
		const orders = await usePagination(em, 'Order', { user: user.id }, limit, offset)
		return orders
	}

	@Mutation(() => UserResponse)
	async sendToken(
		@Arg('username') username: string,
		@Ctx() { redis }: Mycontext
	): Promise<UserResponse> {
		const token = new Array(6)
			.fill(null)
			.map(() => Math.floor(Math.random() * 9 + 1))
			.join('')
		const toShort = await redis.get(
			process.env.PHONE_TOKEN_AT_TIME_PREFIX + username
		)

		if (toShort) {
			return UserResponse.createError('username', '发送太频繁')
		}
		await redis.set(
			process.env.PHONE_TOKEN_AT_TIME_PREFIX + username,
			123,
			'EX',
			parseInt(process.env.PHONE_TOKEN_FREQUENCY_SECONDS)
		)

		const setResult = await redis.set(
			process.env.PHONE_PREFIX + token,
			username,
			'EX',
			parseInt(process.env.PHONE_TOKEN_EXPIRE_SECONDS)
		)
		if (setResult !== 'OK') {
			return UserResponse.createError('username', '服务器出错')
		}
		await sendSMSToken({ username, smsToken: token })
		return UserResponse.createError('username', '发送成功')
	}

	@Mutation(() => UserResponse)
	async phoneLoginOrRegister(
		@Ctx() { em, redis, req }: Mycontext,
		@Arg('options') options: PhoneTokenInput,
		@Arg('password', { nullable: true }) password?: string
	): Promise<UserResponse> {
		const { username, token } = options
		// if (!isPhone(username) || !token) {
		if (!token) {
			return UserResponse.createError('username', '出错了')
		}
		const valiphone = await redis.get(process.env.PHONE_PREFIX + token)
		if (!valiphone || valiphone !== username) {
			return UserResponse.createError('token', '验证码错误')
		}
		redis.del(process.env.PHONE_PREFIX + token)
		const user = await em.findOne(User, { username })
		if (!user) {
			const salt = await bcrypt.genSalt(10)
			let newUser: User

			if (password) {
				const hashedPassword = await bcrypt.hash(password, salt)
				newUser = em.create(User, {
					username: options.username,
					password: hashedPassword,
				})
			} else {
				newUser = em.create(User, { username: options.username })
			}
			await em.persistAndFlush(newUser)

			setAuth(req.session, newUser)
			return { user: newUser }
		}
		await em.persistAndFlush(user)

		setAuth(req.session, user)

		return { user }
	}

	@Mutation(() => UserResponse)
	async createUser(
		@Ctx() { em, req }: Mycontext,
		@Arg('options') options: PhonePasswordInput
	): Promise<UserResponse> {
		const { username, password } = options
		if (!password) {
			return UserResponse.createError('password', '请输入密码')
		}
		const user = await em.findOne(User, { username })
		if (!user) {
			return UserResponse.createError('username', '查无此用户')
		}
		if (!user.password) {
			return UserResponse.createError('phone', '手机注册用户请用手机验证码登陆')
		}

		// const valid = await bcrypt.compare(password, user.password)
		// if (!valid) {
		// 	return UserResponse.createError('password', '密码错误')
		// }
		setAuth(req.session, user)
		return { user }
	}

	@Query(() => User, { nullable: true })
	async me(@Ctx() { req, em }: Mycontext): Promise<User | null> {
		if (!req.session.userId) {
			return null
		}
		const user = await em.findOne(User, { id: req.session.userId })
		if (!user) {
			return null
		}
		return user
	}
	@Mutation(() => Boolean)
	async logout(@Ctx() { req, res }: Mycontext): Promise<boolean> {
		return new Promise((resolve) => {
			req.session.destroy((err) => {
				if (err) {
					console.log(err)
					resolve(false)
					return
				}
				res.clearCookie(process.env.COOKIE_NAME)
				resolve(true)
			})
		})
	}
}
