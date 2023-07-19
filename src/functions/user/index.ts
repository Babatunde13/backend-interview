import * as path from 'path'
import {handlerPath} from '@libs/handlerResolver'

const baseDir = process.cwd()
const handlersPath = path.join(baseDir, 'src/functions')
const usersHandlerPath = path.join(handlersPath, 'user')
const authMiddlewarePath = path.join(handlersPath, 'middlewares')

export const register = {
  handler: `${handlerPath(usersHandlerPath)}/handlers.register`,
  events: [
    {
      http: {
        method: 'post',
        path: 'signup',
      },
    },
  ],
}

export const login = {
  handler: `${handlerPath(usersHandlerPath)}/handlers.login`,
  events: [
    {
      http: {
        method: 'post',
        path: 'signin',
      },
    },
  ],
}

const authPath = `${handlerPath(authMiddlewarePath)}/auth/auth.authMiddleware`
export const loggedInUser = {
  handler: `${handlerPath(usersHandlerPath)}/handlers.loggedInUser`,
  events: [
    {
      http: {
        method: 'get',
        path: 'user',
        authorizer: {
          name: 'auth',
          arn: authPath,
        },
      },
    },
  ],
}
