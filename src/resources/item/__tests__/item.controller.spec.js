import controllers from '../item.controller'
import { isFunction } from 'lodash'

describe('item controllers', () => {
  test('has crud controllers', () => {
    const crudMethods = [
      'getOne',
      'getMany',
      'createOne',
      'updateOne',
      'removeOne',
    ]

    crudMethods.forEach((name) =>
      expect(isFunction(controllers[name])).toBe(true)
    )
  })
})
