import {
	Connection,
	EntityManager,
	FilterQuery,
	IDatabaseDriver,
	QueryOrder,
} from '@mikro-orm/core'
import { EntityName } from './../mikro-orm.config'

export const usePagination = (
	em: EntityManager<IDatabaseDriver<Connection>>,
	type: EntityName,
	searchCondition?: FilterQuery<any>,
	limit?: number,
	offset?: number
) => {
	const realLimit = limit
		? Math.min(parseInt(process.env.PAGE_LIMIT), limit)
		: parseInt(process.env.PAGE_LIMIT)
	const realOffset = offset === undefined ? 0 : offset
	const condition = searchCondition ? searchCondition : {}
	return em.getRepository(type).find(condition, {
		limit: realLimit,
		offset: realOffset,
		orderBy: { createdAt: QueryOrder['DESC'] },
	})
}
