import { Entity, Property } from '@mikro-orm/core'
//  import {MongoClass} from './MongoClass'
import { Field } from 'type-graphql'

@Entity()
export class Post extends MongoClass {
	@Field()
	@Property({ type: 'text' })
	title!: string
}
