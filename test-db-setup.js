import mongoose from 'mongoose'
import cuid from 'cuid'
import _ from 'lodash'
import { Item } from './src/resources/item/item.model'
import { List } from './src/resources/list/list.model'
import { User } from './src/resources/user/user.model'

const models = { User, List, Item }

const url =
  process.env.MONGODB_URI ||
  process.env.DB_URL ||
  'mongodb://localhost:27017/tipe-devapi-testing'

global.newId = () => {
  return mongoose.Types.ObjectId()
}

const remove = (collection) =>
  new Promise((resolve, reject) => {
    collection.deleteMany((err) => {
      if (err) return reject(err)
      resolve()
    })
  })

beforeEach(async () => {
  try {
    const db = cuid()
    function clearDB() {
      return Promise.all(
        _.map(mongoose.connection.collections, (c) => remove(c))
      )
    }

    if (mongoose.connection.readyState === 0) {
      try {
        await mongoose.connect(url + db, {
          autoIndex: true,
        })
        await clearDB()
        await Promise.all(
          Object.keys(models).map((name) => models[name].init())
        )
      } catch (e) {
        console.log('connection error')
        console.error(e)
        throw e
      }
    } else {
      await clearDB()
    }
  } catch (e) {
    console.log(e)
  }
  return
})

afterEach(async () => {
  try {
    await mongoose.connection.db.dropDatabase()
    await mongoose.disconnect()
  } catch (e) {
    console.log(e)
  }
  return
})
afterAll(() => {
  return
})
