import { MikroORM } from '@mikro-orm/core'
import { ApolloServer } from 'apollo-server-express'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import path from 'path'
import { buildSchema } from 'type-graphql'
import { Order } from './entities/Order'
import { Post } from './entities/Post'
import { User } from './entities/User'
import { HelloResolver } from './resolvers/hello'
import { PostResolver } from './resolvers/post'
import { UserResolver } from './resolvers/user'

dotenv.config({ path: path.join(__dirname, '..', '.env') })

const main = async () => {
	const app = express()
	const orm = await MikroORM.init({
		entities: [Post, User, Order],
		type: 'mongo',
		clientUrl: process.env.MONGODB,
		debug: true,
	})
	app.use(cors())

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [PostResolver, HelloResolver, UserResolver],
			validate: false,
		}),
		context: ({ req, res }) => ({ em: orm.em, req, res }),
	})
	apolloServer.applyMiddleware({ app, cors: false })

	app.listen(5000, () => {
		console.log(233333)
	})

	// console.log(123)
	// const createData = orm.em.create(Post, { title: 'Wan' })
	// await orm.em.persistAndFlush(createData)
	// const createUser = orm.em.create(User, { username: 'Wan', password: '123456' })
	// await orm.em.persistAndFlush(createUser)
	// const posts = await orm.em.find(Post, {})
	// console.log(posts)
}

main()
