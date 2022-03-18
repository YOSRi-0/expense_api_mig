"use strict";

var _list = _interopRequireDefault(require("../list.router"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('list router', () => {
  test('has crud routes', () => {
    const routes = [{
      path: '/',
      method: 'get'
    }, {
      path: '/',
      method: 'post'
    }, {
      path: '/:id',
      method: 'get'
    }, {
      path: '/:id',
      method: 'put'
    }, {
      path: '/:id',
      method: 'delete'
    }];
    routes.forEach(route => {
      const match = _list.default.stack.find(s => s.route.path === route.path && s.route.methods[route.method]);

      expect(match).toBeTruthy();
    });
  });
});