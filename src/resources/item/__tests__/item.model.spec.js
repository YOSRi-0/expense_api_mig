import { Item } from '../item.model'
import mongoose from 'mongoose'

describe('Item model', () => {
  describe('schema', () => {
    test('name', () => {
      const name = Item.schema.obj.name
      expect(name).toEqual({
        type: String,
        required: true,
        trim: true,
        maxLength: 20,
      })
    })
  })

  test('amount', () => {
    const amount = Item.schema.obj.amount
    expect(amount).toEqual({
      type: Number,
      required: true,
      trim: true,
    })
  })

  test('date', () => {
    const date = Item.schema.obj.date
    expect(date).toEqual({
      type: Date,
      required: true,
      trim: true,
    })
  })

  test('createdBy', () => {
    const createdBy = Item.schema.obj.createdBy
    expect(createdBy).toEqual({
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'user',
      required: true,
    })
  })

  test('list', () => {
    const list = Item.schema.obj.list
    expect(list).toEqual({
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'list',
      required: true,
    })
  })
})
