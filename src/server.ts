import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import { isTest } from '../env.ts'
import authRoutes from './routes/authRoutes.ts'
import userRoutes from './routes/userRoutes.ts'
import habitRoutes from './routes/habitRoutes.ts'

// test routs
import userv2 from './testRoutes/v2user.ts'

const app = express()

// global middlewares
app.use(helmet()) // to secure express app by setting various HTTP headers
app.use(cors()) // to enable cors
app.use(express.json()) // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })) // to support URL-encoded bodies
app.use(morgan('dev', { skip: () => isTest() })) // to log HTTP requests // skip logging during tests

app.get('/health', (req, res) => {
  res.send('<button>click</dutton>').status(200)
})

// routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/habits', habitRoutes)

// TEST routs
app.use('/api/v2/users', userv2)

export { app }
export default app
