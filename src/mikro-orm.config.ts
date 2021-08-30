import {
	Connection,
	EntityManager,
	IDatabaseDriver,
	MikroORM,
} from '@mikro-orm/core'
import { MongoHighlighter } from '@mikro-orm/mongo-highlighter'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection'
import dotenv from 'dotenv'
import { Request, Response } from 'express'
import { Session, SessionData } from 'express-session'
import { Redis } from 'ioredis'
import path from 'path'
import { Order } from './entities/Order'
import { Post } from './entities/Post'
import { Product } from './entities/Product'
import { User } from './entities/User'

dotenv.config({ path: path.join(__dirname, '..', '.env') })

export type Mycontext = {
	em: EntityManager<IDatabaseDriver<Connection>>
	req: Request & {
		session: Session &
			Partial<SessionData> & {
				userId: string | undefined
				role: string
			}
	}
	res: Response
	redis: Redis
}
export const entities = [Post, User, Order, Product]
const EntityName = ['Post', 'User', 'Order', 'Product'] as const
export type Items = typeof entities[number]
export type ItemInstance = InstanceType<Items>

export type EntityName = typeof EntityName[number]

export default {
	metadataProvider: TsMorphMetadataProvider,
	type: 'mongo',
	ClientUrl: process.env.MONGODB,
	entities,
	highlighter: new MongoHighlighter(),
	debug: process.env.NODE_ENV === 'development',
} as Parameters<typeof MikroORM.init>[0]
