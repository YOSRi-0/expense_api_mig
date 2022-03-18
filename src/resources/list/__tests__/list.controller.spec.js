import controllers from '../list.controller'
import { isFunction } from 'lodash'

describe('list controllers', () => {
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
