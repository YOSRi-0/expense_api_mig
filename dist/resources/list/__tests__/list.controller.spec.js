"use strict";

var _list = _interopRequireDefault(require("../list.controller"));

var _lodash = require("lodash");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('list controllers', () => {
  test('has crud controllers', () => {
    const crudMethods = ['getOne', 'getMany', 'createOne', 'updateOne', 'removeOne'];
    crudMethods.forEach(name => expect((0, _lodash.isFunction)(_list.default[name])).toBe(true));
  });
});