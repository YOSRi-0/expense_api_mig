"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Item = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const itemSchema = new _mongoose.default.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 20
  },
  amount: {
    type: Number,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true,
    trim: true
  },
  createdBy: {
    type: _mongoose.default.SchemaTypes.ObjectId,
    ref: 'user',
    required: true
  },
  list: {
    type: _mongoose.default.SchemaTypes.ObjectId,
    ref: 'list',
    required: true
  }
}, {
  timestamps: true
});
itemSchema.index({
  list: 1,
  name: 1
}, {
  unique: true
});

const Item = _mongoose.default.model('item', itemSchema);

exports.Item = Item;