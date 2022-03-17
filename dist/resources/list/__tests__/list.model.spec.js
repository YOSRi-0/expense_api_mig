"use strict";

var _list = require("../list.model");

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('List model', () => {
  describe('schema', () => {
    test('name', () => {
      const name = _list.List.schema.obj.name;
      expect(name).toEqual({
        type: String,
        required: true,
        trim: true,
        enum: ['expense', 'income']
      });
    });
    test('createdBy', () => {
      const createdBy = _list.List.schema.obj.createdBy;
      expect(createdBy).toEqual({
        type: _mongoose.default.SchemaTypes.ObjectId,
        ref: 'user',
        required: true
      });
    });
  });
});