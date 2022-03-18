"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.start = exports.app = void 0;

var _express = _interopRequireDefault(require("express"));

var _bodyParser = require("body-parser");

var _morgan = _interopRequireDefault(require("morgan"));

var _cors = _interopRequireDefault(require("cors"));

var _config = _interopRequireDefault(require("./config"));

var _db = require("./utils/db");

var _item = _interopRequireDefault(require("./resources/item/item.router"));

var _list = _interopRequireDefault(require("./resources/list/list.router"));

var _user = _interopRequireDefault(require("./resources/user/user.router"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express.default)();
exports.app = app;
app.use((0, _cors.default)());
app.use((0, _bodyParser.json)());
app.use((0, _bodyParser.urlencoded)({
  extended: true
}));
app.use((0, _morgan.default)('dev'));
app.use('/api/item', _item.default);
app.use('/api/list', _list.default);
app.use('/api/user', _user.default);

const start = async () => {
  try {
    await (0, _db.connect)();
    app.listen(_config.default.port, () => {
      console.log(`Server running on http://localhost:${_config.default.port}/api`);
    });
  } catch (e) {
    console.error(e);
  }
};

exports.start = start;