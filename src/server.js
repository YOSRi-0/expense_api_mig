import express from 'express'
import { json, urlencoded } from 'body-parser'
import morgan from 'morgan'
import cors from 'cors'
import config from './config'
import { connect } from './utils/db'
import itemRouter from './resources/item/item.router'
import listRouter from './resources/list/list.router'
import userRouter from './resources/user/user.router'
import { protect, signIn, signUp } from './utils/auth'

export const app = express()

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan('dev'))

app.post('/signup', signUp)
app.post('/signin', signIn)

app.use('/api', protect)
app.use('/api/item', itemRouter)
app.use('/api/list', listRouter)
app.use('/api/user', userRouter)

export const start = async () => {
  try {
    await connect()
    app.listen(config.port, () => {
      console.log(`Server running on http://localhost:${config.port}/api`)
    })
  } catch (e) {
    console.error(e)
  }
}
