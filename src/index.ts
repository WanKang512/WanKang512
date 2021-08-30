import { MikroORM } from '@mikro-orm/core'
import { ApolloServer } from 'apollo-server-express'
import connectRedis from 'connect-redis'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import session from 'express-session'
import { RedisPubSub } from 'graphql-redis-subscriptions'
// import http from 'http'
import Redis from 'ioredis'
import path from 'path'
import { buildSchema } from 'type-graphql'
import { Order } from './entities/Order'
import { Post } from './entities/Post'
import { Product } from './entities/Product'
import { User } from './entities/User'
import { adminResolvers } from './resolvers/admin'
import { HelloResolver } from './resolvers/hello'
// import { PaymentResolver } from './resolvers/pay'
import { PostResolver } from './resolvers/post'
import { ProfilePictureResolver } from './resolvers/profilePicture'
import { UserResolver } from './resolvers/user'
// import { alipayCallBack } from './utls/alipay'

dotenv.config({ path: path.join(__dirname, '..', '.env') })

const main = async () => {
	// let orm = await MikroORM.init(microConfig)
	const app = express()
	const orm = await MikroORM.init({
		entities: [Post, User, Order, Product],
		type: 'mongo',
		clientUrl: process.env.MONGODB,
		debug: true,
	})
	const RedisStore = connectRedis(session)
	const options: Redis.RedisOptions = {
		host: process.env.REDIS_URL,
		password: process.env.REDIS_PASSWORD,
		retryStrategy: (times) => Math.max(times * 100, 3000),
	}
	const redis = new Redis(process.env.REDIS_URL, options)

	const pubSub = new RedisPubSub({
		publisher: new Redis(process.env.REDIS_URL, options),
		subscriber: new Redis(process.env.REDIS_URL, options),
	})
	app.set('trust proxy', 1)
	app.use(
		cors({
			origin: process.env.MONGODB,
			credentials: true,
		})
	)
	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [
				HelloResolver,
				PostResolver,
				UserResolver,
				ProfilePictureResolver,
				// PaymentResolver,
				...adminResolvers,
			],
			validate: false,
			pubSub,
		}),
		context: ({ req, res }) => ({
			em: orm.em,
			req,
			res,
			redis,
			// userLoader: createUserLoader(orm.em, 'User'),
		}),
		// validationRules: [
		// 	QueryComplexity({
		// 		estimators: [simpleEstimator({ defaultComplexity: 1 })],
		// 		maximumComplexity: parseInt(process.env.MAX_QUERY_COMPLEXITY),
		// 		variables: {},
		// 		onComplete: (complexity: number) => {
		// 			console.log('Query Complexity:', complexity)
		// 		},
		// 	}),
		// ],
	})
	app.use(
		session({
			name: process.env.COOKIE_NAME,
			store: new RedisStore({ client: redis, disableTouch: true }), // TOUCH 可以延长有效时间 TTL
			cookie: {
				maxAge: 1000 * 60 * 60 * parseInt(process.env.COOKIE_MAXAGE_HOURS),
				httpOnly: true,
				sameSite: 'lax', // csrf
				secure: process.env.NODE_ENV === 'production',
			},

			secret: process.env.REDIS_SECRET,
			saveUninitialized: false,
			resave: false,
		})
	)

	apolloServer.applyMiddleware({ app, cors: false })
	const PORT = process.env.PORT || 8000
	app.listen(PORT)
	// app.use(express.urlencoded({ extended: true }))
	// app.post(process.env.ALIPAY_CB, async (req: Request, res: Response) => {
	// 	await alipayCallBack(req, res, orm.em, pubSub)
	// })
	// const httpServer = http.createServer(app)
	// apolloServer.installSubscriptionHandlers(httpServer)
	// httpServer.listen(parseInt(process.env.PORT), () => {
	// 	console.log(
	// 		`server is on http://${
	// 			process.env.NODE_ENV === 'production' ? process.env.SERVER_URL : 'localhost'
	// 		}:${process.env.PORT}${apolloServer.graphqlPath}`
	// 	)
	// })
	// console.log(process.env.PORT)
}

main()
