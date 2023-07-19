import {v4} from 'uuid'
import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import * as jwt from 'jsonwebtoken'
import {successResponse, errorResponse} from '@libs/apiGateway'
import {middyfy} from '@libs/lambda'
import {userService} from '../../services'
import {loginValidator, signupValidator} from '@libs/requestValidator'

const registerHandler = async (
    event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  event.body = JSON.parse(Buffer.from(event.body, 'base64').toString())
  try {
    const validationResp = signupValidator(event.body)
    if (validationResp.error) {
      errorResponse({message: validationResp.message}, 400)
    }
    const id = v4()
    const createUserResponse = await userService.createUser({
      userId: id,
      name: validationResp.data.name,
      email: validationResp.data.email,
      password: validationResp.data.password,
      address: validationResp.data.address,
      phone: validationResp.data.phone,
      createdAt: new Date().toISOString(),
    })
    return successResponse({user: createUserResponse}, 201)
  } catch (error) {
    return errorResponse({message: 'Something went wrong'})
  }
}

const loginHandler = async (
    event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  event.body = JSON.parse(Buffer.from(event.body, 'base64').toString())
  try {
    const validationResp = loginValidator(event.body)
    if (validationResp.error) {
      errorResponse({message: validationResp.message}, 400)
    }
    const loginResponse = await userService.login(
        validationResp.data.email,
        validationResp.data.password,
    )
    return successResponse({loginResponse})
  } catch (error) {
    if (error.message === 'Invalid email or password') {
      return errorResponse({message: error.message}, 400)
    }
    return errorResponse({message: 'Something went wrong'})
  }
}

const loggedInUserHandler = async (
    event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const authHeader = event.headers.Authorization
    if (!authHeader) {
      return errorResponse({message: 'Unauthorized'}, 401)
    }
    if (authHeader.split(' ').length !== 2) {
      return errorResponse({message: 'Unauthorized'}, 401)
    }
    const token = authHeader.split(' ')[1]
    const userId = jwt.verify(token, process.env.JWT_SECRET) as string
    const user = await userService.getUserById(userId)
    if (!user) {
      return errorResponse({message: 'Unauthorized'}, 401)
    }
    return successResponse({user})
  } catch (error) {
    return errorResponse({message: 'Something went wrong'})
  }
}

export const register = middyfy(registerHandler)
export const login = middyfy(loginHandler)
export const loggedInUser = middyfy(loggedInUserHandler)
