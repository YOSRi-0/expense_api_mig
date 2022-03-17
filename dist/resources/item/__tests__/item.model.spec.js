"use strict";

var _item = require("../item.model");

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Item model', () => {
  describe('schema', () => {
    test('name', () => {
      const name = _item.Item.schema.obj.name;
      expect(name).toEqual({
        type: String,
        required: true,
        trim: true,
        maxLength: 20
      });
    });
  });
  test('amount', () => {
    const amount = _item.Item.schema.obj.amount;
    expect(amount).toEqual({
      type: Number,
      required: true,
      trim: true
    });
  });
  test('date', () => {
    const date = _item.Item.schema.obj.date;
    expect(date).toEqual({
      type: Date,
      required: true,
      trim: true
    });
  });
  test('createdBy', () => {
    const createdBy = _item.Item.schema.obj.createdBy;
    expect(createdBy).toEqual({
      type: _mongoose.default.SchemaTypes.ObjectId,
      ref: 'user',
      required: true
    });
  });
  test('list', () => {
    const list = _item.Item.schema.obj.list;
    expect(list).toEqual({
      type: _mongoose.default.SchemaTypes.ObjectId,
      ref: 'list',
      required: true
    });
  });
});