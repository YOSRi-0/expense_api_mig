"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _config = _interopRequireDefault(require("../../config"));

var _user = require("../../resources/user/user.model");

var _auth = require("../auth");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Authentication', () => {
  describe('newToken', () => {
    test('create new token from user', () => {
      const id = 123;
      const token = (0, _auth.newToken)({
        id
      });

      const user = _jsonwebtoken.default.verify(token, _config.default.secrets.jwt);

      expect(user.id).toBe(id);
    });
  });
  describe('verifyToken', () => {
    test('validates jwt and return payload', async () => {
      const id = 1234;

      const token = _jsonwebtoken.default.sign({
        id
      }, _config.default.secrets.jwt);

      const user = await (0, _auth.verifyToken)(token);
      expect(user.id).toBe(id);
    });
  });
  describe('signUp', () => {
    test('requires email and password', async () => {
      expect.assertions(2);
      const req = {
        body: {}
      };
      const res = {
        status(status) {
          expect(status).toBe(400);
          return this;
        },

        send(result) {
          expect(typeof result.message).toBe('string');
        }

      };
      await (0, _auth.signUp)(req, res);
    });
    test('creates user and sends new token from user', async () => {
      expect.assertions(2);
      const req = {
        body: {
          email: 'hello@gmail.com',
          password: '2343yoyo'
        }
      };
      const res = {
        status(status) {
          expect(status).toBe(201);
          return this;
        },

        async send(result) {
          const {
            id: userId
          } = await (0, _auth.verifyToken)(result.token);
          const user = await _user.User.findById(userId).lean().exec();
          expect(user.email).toBe('hello@gmail.com');
        }

      };
      await (0, _auth.signUp)(req, res);
    });
  });
  describe('signIn', () => {
    test('requires email and password', async () => {
      expect.assertions(2);
      const req = {
        body: {}
      };
      const res = {
        status(status) {
          expect(status).toBe(400);
          return this;
        },

        send(result) {
          expect(typeof result.message).toBe('string');
        }

      };
      await (0, _auth.signIn)(req, res);
    });
    test('user must exist', async () => {
      expect.assertions(2);
      const req = {
        body: {
          email: 'hello@gmail.com',
          password: '23434yoyo'
        }
      };
      const res = {
        status(status) {
          expect(status).toBe(401);
          return this;
        },

        send(result) {
          expect(typeof result.message).toBe('string');
        }

      };
      await (0, _auth.signIn)(req, res);
    });
    test('password must match', async () => {
      expect.assertions(2);
      await _user.User.create({
        email: 'hello@gmail.com',
        password: 'youtou'
      });
      const req = {
        body: {
          email: 'hello@gmail.com',
          password: 'wrong'
        }
      };
      const res = {
        status(status) {
          expect(status).toBe(401);
          return this;
        },

        send(result) {
          expect(typeof result.message).toBe('string');
        }

      };
      await (0, _auth.signIn)(req, res);
    });
  });
  describe('protect', () => {
    test('look for bearer token in header', async () => {
      expect.assertions(2);
      const req = {
        headers: {}
      };
      const res = {
        status(status) {
          expect(status).toBe(401);
          return this;
        },

        end() {
          expect(true).toBe(true);
        }

      };
      await (0, _auth.protect)(req, res);
    });
    test('token must have correct prefix', async () => {
      expect.assertions(2);
      const req = {
        headers: {
          authorization: (0, _auth.newToken)({
            id: '232FZF'
          })
        }
      };
      const res = {
        status(status) {
          expect(status).toBe(401);
          return this;
        },

        end() {
          expect(true).toBe(true);
        }

      };
      await (0, _auth.protect)(req, res);
    });
    test('must be a real user', async () => {
      expect.assertions(2);
      const token = `Bearer ${(0, _auth.newToken)({
        id: _mongoose.default.Types.ObjectId()
      })}`;
      const req = {
        headers: {
          authorization: token
        }
      };
      const res = {
        status(status) {
          expect(status).toBe(401);
          return this;
        },

        end() {
          expect(true).toBe(true);
        }

      };
      await (0, _auth.protect)(req, res);
    });
    test('find user from token and passes on', async () => {
      expect.assertions(2);
      const user = await _user.User.create({
        email: 'hello@gmail.com',
        password: '123456'
      });
      const token = `Bearer ${(0, _auth.newToken)(user)}`;
      const req = {
        headers: {
          authorization: token
        }
      };

      const next = () => {};

      await (0, _auth.protect)(req, {}, next);
      expect(req.user._id.toString()).toBe(user._id.toString());
      expect(req.user).not.toHaveProperty('password');
    });
  });
});