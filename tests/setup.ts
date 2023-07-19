import * as request from 'supertest'

console.log(process.env.PORT)
const PORT = process.env.PORT || 3000

export const testRequest = request(`http://localhost:${PORT}`)
