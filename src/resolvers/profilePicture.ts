import { createWriteStream } from 'fs'
import { GraphQLUpload } from 'graphql-upload'
import path from 'path'
import { Stream } from 'stream'
import { Arg, Mutation, Resolver } from 'type-graphql'
export interface Upload {
	filename: string
	mimetype: string
	encoding: string
	createReadStream: () => Stream
}
@Resolver()
export class ProfilePictureResolver {
	@Mutation(() => Boolean)
	async addProfilePicture(
		@Arg('picture', () => GraphQLUpload)
		{ createReadStream, filename }: Upload
	): Promise<boolean> {
		return new Promise(async (resolve, reject) =>
			createReadStream()
				.pipe(
					createWriteStream(path.join(__dirname, '../', '../', 'uploads/', filename))
				)
				.on('finish', () => resolve(true))
				.on('error', () => reject(false))
		)
	}
}
