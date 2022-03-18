import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import config from '../../config'
import { User } from '../../resources/user/user.model'
import { newToken, protect, signIn, signUp, verifyToken } from '../auth'

describe('Authentication', () => {
  describe('newToken', () => {
    test('create new token from user', () => {
      const id = 123
      const token = newToken({ id })
      const user = jwt.verify(token, config.secrets.jwt)

      expect(user.id).toBe(id)
    })
  })

  describe('verifyToken', () => {
    test('validates jwt and return payload', async () => {
      const id = 1234
      const token = jwt.sign({ id }, config.secrets.jwt)
      const user = await verifyToken(token)
      expect(user.id).toBe(id)
    })
  })

  describe('signUp', () => {
    test('requires email and password', async () => {
      expect.assertions(2)

      const req = { body: {} }
      const res = {
        status(status) {
          expect(status).toBe(400)
          return this
        },
        send(result) {
          expect(typeof result.message).toBe('string')
        },
      }

      await signUp(req, res)
    })

    test('creates user and sends new token from user', async () => {
      expect.assertions(2)

      const req = { body: { email: 'hello@gmail.com', password: '2343yoyo' } }
      const res = {
        status(status) {
          expect(status).toBe(201)
          return this
        },
        async send(result) {
          const { id: userId } = await verifyToken(result.token)
          const user = await User.findById(userId).lean().exec()
          expect(user.email).toBe('hello@gmail.com')
        },
      }

      await signUp(req, res)
    })
  })

  describe('signIn', () => {
    test('requires email and password', async () => {
      expect.assertions(2)

      const req = { body: {} }
      const res = {
        status(status) {
          expect(status).toBe(400)
          return this
        },
        send(result) {
          expect(typeof result.message).toBe('string')
        },
      }

      await signIn(req, res)
    })

    test('user must exist', async () => {
      expect.assertions(2)

      const req = { body: { email: 'hello@gmail.com', password: '23434yoyo' } }
      const res = {
        status(status) {
          expect(status).toBe(401)
          return this
        },
        send(result) {
          expect(typeof result.message).toBe('string')
        },
      }

      await signIn(req, res)
    })

    test('password must match', async () => {
      expect.assertions(2)

      await User.create({
        email: 'hello@gmail.com',
        password: 'youtou',
      })

      const req = { body: { email: 'hello@gmail.com', password: 'wrong' } }
      const res = {
        status(status) {
          expect(status).toBe(401)
          return this
        },
        send(result) {
          expect(typeof result.message).toBe('string')
        },
      }

      await signIn(req, res)
    })
  })

  describe('protect', () => {
    test('look for bearer token in header', async () => {
      expect.assertions(2)

      const req = { headers: {} }
      const res = {
        status(status) {
          expect(status).toBe(401)
          return this
        },
        end() {
          expect(true).toBe(true)
        },
      }

      await protect(req, res)
    })

    test('token must have correct prefix', async () => {
      expect.assertions(2)

      const req = { headers: { authorization: newToken({ id: '232FZF' }) } }
      const res = {
        status(status) {
          expect(status).toBe(401)
          return this
        },
        end() {
          expect(true).toBe(true)
        },
      }

      await protect(req, res)
    })

    test('must be a real user', async () => {
      expect.assertions(2)

      const token = `Bearer ${newToken({ id: mongoose.Types.ObjectId() })}`
      const req = { headers: { authorization: token } }

      const res = {
        status(status) {
          expect(status).toBe(401)
          return this
        },
        end() {
          expect(true).toBe(true)
        },
      }

      await protect(req, res)
    })

    test('find user from token and passes on', async () => {
      expect.assertions(2)

      const user = await User.create({
        email: 'hello@gmail.com',
        password: '123456',
      })

      const token = `Bearer ${newToken(user)}`
      const req = { headers: { authorization: token } }

      const next = () => {}
      await protect(req, {}, next)
      expect(req.user._id.toString()).toBe(user._id.toString())
      expect(req.user).not.toHaveProperty('password')
    })
  })
})
