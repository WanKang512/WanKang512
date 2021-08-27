import { Collection, Entity, OneToMany, Property } from '@mikro-orm/core'
import { Field, Float, InputType, ObjectType } from 'type-graphql'
import { MongoClass } from './MongoClass'
import { Order } from './Order'
import { Post } from './Post'

@InputType()
export class adminUserInput {
	@Field()
	username: string

	@Field()
	password?: string

	@Field()
	phoneCode?: string
}

@ObjectType({ implements: MongoClass })
@Entity()
export class User extends MongoClass {
	@Field(() => String)
	@Property({ type: 'text', unique: true })
	username!: string

	@Property({ type: 'text' })
	password!: string

	@Field(() => String)
	@Property({})
	phoneCode!: 'USER'

	@Field(() => Float)
	@Property()
	balance = 0

	@Field(() => [Post])
	@OneToMany(() => Post, (post) => post.creator)
	posts = new Collection<Post>(this)

	@Field(() => [Order])
	@OneToMany(() => Order, (order) => order.user)
	orders = new Collection<Order>(this)
}
