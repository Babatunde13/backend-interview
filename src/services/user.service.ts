import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import User from '../model/user.model'

export default class UserService {
	private TableName: string = 'UsersTable'

	constructor(private docClient: DocumentClient) { }

	private getToken(userId: string) {
		return jwt.sign(
			{ userId },
			process.env.JWT_SECRET,
			{ expiresIn: '1d' }
		)
	}

	async hashPassword(password: string): Promise<string> {
		const salt = await bcrypt.genSalt(10)
		const passwordHash = await bcrypt.hash(password, salt)
		return passwordHash
	}

	async comparePassword(password: string, hashPassword: string): Promise<boolean> {
		const isMatch = await bcrypt.compare(password, hashPassword)
    	return isMatch
	}

	async createUser(user: User): Promise<User> {
    	const hashPassword = await this.hashPassword(user.password)
    	user.password = hashPassword

    	const params = {
    		TableName: this.TableName,
    		Item: user
    	}
    	await this.docClient.put(params).promise()
		delete user.password
    	return user
	}

	async login(email: string, password: string) {
    	const params = {
    		TableName: this.TableName,
    		IndexName: 'email-index',
    		KeyConditionExpression: 'email = :email',
    		ExpressionAttributeValues: {
    			':email': email
    		}
    	}
    	const result = await this.docClient.query(params).promise()
    	if (result.Items.length === 0) {
    		throw Error('Invalid email or password')
    	}
    	const user = result.Items[0] as User
    	const isMatch = await this.comparePassword(password, user.password)
    	if (!isMatch) {
    		throw new Error('Invalid email or password')
    	}

		const token = this.getToken(user.userId)
		delete user.password
    	return { user, token }
	}

	async getUserById(userId: string): Promise<User> {
    	const params = {
    		TableName: this.TableName,
    		Key: {
    			userId
    		}
    	}
    	const result = await this.docClient.get(params).promise()
    	return result.Item as User
	}
}
