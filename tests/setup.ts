import * as request from 'supertest'

const PORT = process.env.PORT || 8080

export const testRequest = request(`http://localhost:${PORT}`)
