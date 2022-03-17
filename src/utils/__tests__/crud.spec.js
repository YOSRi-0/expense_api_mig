import mongoose from 'mongoose'
import { List } from '../../resources/list/list.model'
import { getOne } from '../crud'

describe('crud controllers', () => {
  describe('getOne', () => {
    test('find by authenticated user and id', async () => {
      expect.assertions(2)

      const user = mongoose.Types.ObjectId()
      console.log(user)
      const list = await List.create({ name: 'expense', createdBy: user })

      const req = {
        params: {
          id: list._id,
        },
        user: {
          _id: user,
        },
      }

      const res = {
        status(status) {
          expect(status).toBe(200)
          return this
        },
        json(result) {
          expect(result.data._id.toString()).toBe(list._id.toString())
        },
      }

      await getOne(List)(req, res)
    })

    test('404 if no doc was found', async () => {
      expect.assertions(2)

      const user = mongoose.Types.ObjectId()

      const req = {
        params: {
          id: mongoose.Types.ObjectIdj(),
        },
        user: {
          _id: user,
        },
      }

      const res = {
        status(status) {
          expect(status).toBe(404)
          return this
        },
        end() {
          expect(true).toBe(true)
        },
      }

      await getOne(List)(req, res)
    })
  })

  // next crud test >>
})
