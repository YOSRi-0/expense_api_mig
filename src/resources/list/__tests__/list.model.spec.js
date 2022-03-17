import { List } from '../list.model'
import mongoose from 'mongoose'

describe('List model', () => {
  describe('schema', () => {
    test('name', () => {
      const name = List.schema.obj.name
      expect(name).toEqual({
        type: String,
        required: true,
        trim: true,
      })
    })

    test('createdBy', () => {
      const createdBy = List.schema.obj.createdBy
      expect(createdBy).toEqual({
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
        required: true,
      })
    })
  })
})
