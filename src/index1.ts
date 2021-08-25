import { MikroORM } from '@mikro-orm/core'
import { ApolloServer } from 'apollo-server-express'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import path from 'path'
import { buildSchema } from 'type-graphql'
import { Post } from './entities/Post'
import { HelloResolver } from './resolvers/hello'
import { PostResolver } from './resolvers/post'

dotenv.config({ path: path.join(__dirname, '..', '.env') })

const main = async () => {
	const app = express()
	const orm = await MikroORM.init({
		entities: [Post],
		type: 'mongo',
		clientUrl: process.env.MONGODB,
		debug: true,
	})
	app.use(
		cors({
			origin: 'http://localhost:3000',
			credentials: true,
		})
	)

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [PostResolver, HelloResolver],
			validate: false,
		}),
		context: ({ req, res }) => ({ em: orm.em, req, res }),
	})
	apolloServer.applyMiddleware({ app, cors: false })

	app.listen(3004, () => {
		console.log(233333)
	})

	console.log(123)
	const createData = orm.em.create(Post, { title: 'Wan' })
	await orm.em.persistAndFlush(createData)

	const posts = await orm.em.find(Post, {})
	console.log(posts)
}

main()
