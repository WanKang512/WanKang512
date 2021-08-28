import bcrypt from 'bcryptjs'
import {
	Arg,
	Ctx,
	Field,
	InputType,
	Mutation,
	ObjectType,
	Resolver,
} from 'type-graphql'
import { User } from '../entities/User'
import { Mycontext } from '../mikro-orm.config'
import { isPhone } from '../utls/isPhone'
import { setAuth } from '../utls/setAuth'

@InputType()
class PasswordInput {
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
	@Mutation(() => UserResponse)
	async phoneLoginOrRegister(
		@Ctx() { em, redis, req }: Mycontext,
		@Arg('options') options: PhoneTokenInput,
		@Arg('password', { nullable: true }) password?: string
	): Promise<UserResponse> {
		const { username, token } = options
		if (!isPhone(username) || !token) {
			return UserResponse.createError('phone', '出错了')
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
		@Ctx() { em }: Mycontext,
		@Arg('options') options: PasswordInput
	): Promise<UserResponse> {
		const { username, password } = options
		if (!password) {
			return UserResponse.createError('password', '请输入密码')
		}
		const user = await em.findOne(User, { username })
		if (!user) {
			return UserResponse.createError('username', '查无此用户')
		}
		// if (!phoneCode) {
		// 	return UserResponse.createError('phoneCode', '手机注册用户请用手机验证码登陆')
		// }
		// setAuth(req.session, user)
		return { user }
	}
}
