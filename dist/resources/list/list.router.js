"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _list = _interopRequireDefault(require("./list.controller"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = (0, _express.Router)();
router.route('/').get(_list.default.getMany).post(_list.default.createOne);
router.route('/:id').get(_list.default.getOne).put(_list.default.updateOne).delete(_list.default.removeOne);
var _default = router;
exports.default = _default;