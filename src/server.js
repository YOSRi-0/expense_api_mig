import express from 'express'
import { json, urlencoded } from 'body-parser'
import morgan from 'morgan'
import cors from 'cors'
import config from './config'
import { connect } from './utils/db'

export const app = express()

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan('dev'))

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
