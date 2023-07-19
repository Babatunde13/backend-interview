import dynamoDBClient from './index'

export const deleteTable = async (tableName: string) => {
  const database = dynamoDBClient()
  const params = {
    TableName: tableName,
    Key: {},
  }

  await database.delete(params).promise()
}
