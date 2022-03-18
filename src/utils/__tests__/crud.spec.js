import mongoose from 'mongoose'
import { List } from '../../resources/list/list.model'
import { getOne, getMany, createOne, updateOne, removeOne } from '../crud'

describe('crud controllers', () => {
  describe('getOne', () => {
    test('find by authenticated user and id', async () => {
      expect.assertions(2)

      const user = mongoose.Types.ObjectId()
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
          id: mongoose.Types.ObjectId(),
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

  describe('getMany', () => {
    test('finds array of docs by authenticated user', async () => {
      expect.assertions(4)

      const user = mongoose.Types.ObjectId()
      await List.create([
        { name: 'income', createdBy: user },
        { name: 'expense', createdBy: user },
        { name: 'expense', createdBy: mongoose.Types.ObjectId() },
      ])

      const req = {
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
          expect(result.data).toHaveLength(2)
          result.data.forEach((doc) =>
            expect(`${doc.createdBy}`).toBe(`${user}`)
          )
        },
      }

      await getMany(List)(req, res)
    })
  })

  describe('createOne', () => {
    test('creates a new doc', async () => {
      expect.assertions(2)

      const user = mongoose.Types.ObjectId()
      const body = { name: 'expense' }

      const req = {
        user: { _id: user },
        body,
      }

      const res = {
        status(status) {
          expect(status).toBe(201)
          return this
        },
        json(result) {
          expect(result.data.name).toBe(body.name)
        },
      }

      await createOne(List)(req, res)
    })

    test('createdBy should be the authenticated user', async () => {
      expect.assertions(2)

      const user = mongoose.Types.ObjectId()
      const body = { name: 'income' }

      const req = {
        user: { _id: user },
        body,
      }

      const res = {
        status(status) {
          expect(status).toBe(201)
          return this
        },
        json(result) {
          expect(result.data.createdBy.toString()).toBe(user.toString())
        },
      }

      await createOne(List)(req, res)
    })
  })

  describe('updateOne', () => {
    test('find doc by authenticated user and id to update', async () => {
      expect.assertions(3)

      const user = mongoose.Types.ObjectId()
      const list = await List.create({ name: 'expense', createdBy: user })
      const update = { name: 'income' }

      const req = {
        user: { _id: user },
        params: { id: list._id },
        body: update,
      }

      const res = {
        status(status) {
          expect(status).toBe(200)
          return this
        },
        json(result) {
          expect(result.data._id.toString()).toBe(list._id.toString())
          expect(result.data.name).toBe(update.name)
        },
      }

      await updateOne(List)(req, res)
    })

    test('400 if no doc', async () => {
      expect.assertions(2)

      const user = mongoose.Types.ObjectId()
      const update = { name: 'income' }

      const req = {
        user: { _id: user },
        params: { _id: mongoose.Types.ObjectId() },
        body: update,
      }

      const res = {
        status(status) {
          expect(status).toBe(400)
          return this
        },
        end() {
          expect(true).toBe(true)
        },
      }

      await updateOne(List)(req, res)
    })
  })

  describe('removeOne', () => {
    test('find doc by authenticated user and id to remove', async () => {
      expect.assertions(2)

      const user = mongoose.Types.ObjectId()
      const list = await List.create({ name: 'expense', createdBy: user })

      const req = {
        params: { id: list._id },
        user: { _id: user },
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

      await removeOne(List)(req, res)
    })

    test('400 if no doc', async () => {
      expect.assertions(2)

      const user = mongoose.Types.ObjectId()

      const req = {
        params: { id: mongoose.Types.ObjectId() },
        user: { _id: user },
      }

      const res = {
        status(status) {
          expect(status).toBe(400)
          return this
        },
        end() {
          expect(true).toBe(true)
        },
      }

      await removeOne(List)(req, res)
    })
  })
  // next crud test >>
})
