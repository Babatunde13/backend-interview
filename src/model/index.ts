import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

export const database = process.env.IS_OFFLINE ? new AWS.DynamoDB({
	region: 'localhost',
	endpoint: 'dynamodb-local:8000',
}) : new AWS.DynamoDB()

const dynamoDBClient = (): DocumentClient => {
	if (process.env.IS_OFFLINE) {
		console.log('Creating a local DynamoDB instance')
		return new AWS.DynamoDB.DocumentClient({
			region: 'localhost',
			endpoint: 'dynamodb-local:8000',
			accessKeyId: 'fakeMyKeyId',
			secretAccessKey: 'fakeSecretAccessKey'
		})
	}
	return new AWS.DynamoDB.DocumentClient()
}

export default dynamoDBClient
