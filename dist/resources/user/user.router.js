"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

const router = (0, _express.Router)();
router.route('/').get().post();
router.route('/:id').get().put().delete();
var _default = router;
exports.default = _default;