"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.List = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const listSchema = new _mongoose.default.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    enum: ['expense', 'income']
  },
  createdBy: {
    type: _mongoose.default.SchemaTypes.ObjectId,
    ref: 'user',
    required: true
  }
}, {
  timestamps: true
});
listSchema.index({
  createdBy: 1,
  name: 1
}, {
  unique: true
});

const List = _mongoose.default.model('list', listSchema);

exports.List = List;