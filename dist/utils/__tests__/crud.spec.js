"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));

var _list = require("../../resources/list/list.model");

var _crud = require("../crud");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('crud controllers', () => {
  describe('getOne', () => {
    test('find by authenticated user and id', async () => {
      expect.assertions(2);

      const user = _mongoose.default.Types.ObjectId();

      console.log(user);
      const list = await _list.List.create({
        name: 'expense',
        createdBy: user
      });
      const req = {
        params: {
          id: list._id
        },
        user: {
          _id: user
        }
      };
      const res = {
        status(status) {
          expect(status).toBe(200);
          return this;
        },

        json(result) {
          expect(result.data._id.toString()).toBe(list._id.toString());
        }

      };
      await (0, _crud.getOne)(_list.List)(req, res);
    });
    test('404 if no doc was found', async () => {
      expect.assertions(2);

      const user = _mongoose.default.Types.ObjectId();

      const req = {
        params: {
          id: _mongoose.default.Types.ObjectId()
        },
        user: {
          _id: user
        }
      };
      const res = {
        status(status) {
          expect(status).toBe(404);
          return this;
        },

        end() {
          expect(true).toBe(true);
        }

      };
      await (0, _crud.getOne)(_list.List)(req, res);
    });
  }); // next crud test >>
});