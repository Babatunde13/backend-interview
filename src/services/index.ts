import dynamoDBClient from '../model'
import UserService from './user.service'

export const userService = new UserService(dynamoDBClient())
