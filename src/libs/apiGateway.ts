import type {APIGatewayProxyEvent, APIGatewayProxyResult, Handler} from 'aws-lambda'
import type {FromSchema} from 'json-schema-to-ts'

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

export const successResponse = (response: Record<string, unknown>, statusCode = 200) => {
  return {
    statusCode,
    body: JSON.stringify(response),
  }
}

export const errorResponse = (response: Record<string, unknown>, statusCode = 500) => {
  return {
    statusCode,
    body: JSON.stringify(response),
  }
}
