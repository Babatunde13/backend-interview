import { expect } from 'chai'
import { testRequest } from '../../setup'
import { deleteTable } from '../../../src/model/drop_table'

describe('User handlers', () => {
	after(async () => {
		await deleteTable('UsersTable')
	})

	describe('register', () => {
		it('should return invalid email if email is invalid', async () => {
			const response = await testRequest.post('/dev/signup').send({
				name: 'test',
				email: 'test',
				address: 'test',
				phone: 'test',
				password: 'test'
			})

			expect(response.status).to.equal(400)
			expect(JSON.parse(response.body).message).to.equal('Email is invalid')
		})

		it('should return invalid password if password is invalid', async () => {
			const response = await testRequest.post('/dev/signup').send({
				name: 'test',
				email: 'test@gmail.com',
				address: 'test',
				phone: 'test',
				password: 'test'
			})

			expect(response.status).to.equal(400)
			expect(JSON.parse(response.body).message).to.equal('Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character')
		})

		it('should return invalid name if name is invalid', async () => {
			const response = await testRequest.post('/dev/signup').send({
				name: 'test',
				email: 'test@gmail.com',
				address: 'test',
				phone: 'test',
				password: 'Sometest@123'
			})

			expect(response.status).to.equal(400)
			expect(JSON.parse(response.body).message).to.equal('Name should contain only letters with fname and lname separated by a space')
		})

		it('should return invalid phone number if phone number is invalid', async () => {
			const response = await testRequest.post('/dev/signup').send({
				name: 'Test User',
				email: 'test@gmail.com',
				address: 'test',
				phone: '1234567890',
				password: 'Sometest@123'
			})

			expect(response.status).to.equal(400)
			expect(JSON.parse(response.body).message).to.equal('Phone number should be 10 digits long prefixed with +234 or 0')
		})

		it('should create new user', async () => {
			const response = await testRequest.post('/dev/signup').send({
				name: 'Test User',
				email: 'test@gmail.com',
				address: '123, XYZ Street, ABC City',
				phone: '2341234567890',
				password: 'Sometest@123'
			})

			expect(response.status).to.equal(201)
			const createdUser = JSON.parse(response.body).user
			expect(createdUser._id).to.be.a('string')
			expect(createdUser.name).to.equal('Test User')
			expect(createdUser.email).to.equal('test@gmail.com')
			expect(createdUser.address).to.equal('123, XYZ Street, ABC City')
			expect(createdUser.phone).to.equal('+2341234567890')
			expect(createdUser.password).to.be.undefined
		})
	})

	describe('login', () => {
		it('should return a 400 error if account does not exist', async () => {
			const response = await testRequest.post('/dev/signin').send({
				email: 'test123@gmail.com',
				password: 'Sometest@123'
			})

			expect(response.status).to.equal(400)
			expect(JSON.parse(response.body).message).to.equal('Invalid email or password')
		})

		it('should login and send token', async () => {
			const response = await testRequest.post('/dev/signin').send({
				email: 'test@gmail.com',
				password: 'Sometest@123'
			})

			expect(response.status).to.equal(200)
			expect(JSON.parse(response.body).token).to.be.a('string')
			const loggedInUser = JSON.parse(response.body).user
			expect(loggedInUser._id).to.be.a('string')
			expect(loggedInUser.name).to.equal('Test User')
			expect(loggedInUser.email).to.equal('test@gmail.com')
		})
	})

	describe('loggedInUser', () => {
		it('should return a 401 error if authorization is not set', async () => {
			const response = await testRequest.get('/dev/user').send({})
			expect(response.status).to.equal(401)
		})

		it('should return a 401 error if authorization is invalid', async () => {
			const token = 'invalid'
			const response = await testRequest.get('/dev/user').send({})
				.set('Authorization', `Bearer ${token}`)
            
			expect(response.status).to.equal(401)
		})

		it('should show user details', async () => {
			const loginResp = await testRequest.post('/dev/signin').send({
				email: 'test@gmail.com',
				password: 'Sometest@123'
			})

			const token = JSON.parse(loginResp.body).token

			const response = await testRequest.get('/dev/user').send({})
				.set('Authorization', `Bearer ${token}`)

			expect(response.status).to.equal(200)
			const loggedInUser = JSON.parse(response.body).user
			expect(loggedInUser._id).to.be.a('string')
			expect(loggedInUser.name).to.equal('Test User')
			expect(loggedInUser.email).to.equal('test@gmail.com')
		})
	})
})
