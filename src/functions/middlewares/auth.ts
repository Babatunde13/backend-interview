import * as jwt from 'jsonwebtoken'
import { errorResponse } from '@libs/apiGateway'
import { middyfy } from '@libs/lambda'

export const authMiddleware = middyfy(async (event, context) => {
	try {
		const token = event.headers.Authorization
		const decoded = jwt.verify(token, process.env.JWT_SECRET)
		event.user = decoded
		context.user = decoded
		return event
	} catch (error) {
		return errorResponse({
			message: 'Invalid token',
		}, 401)
	}
})
