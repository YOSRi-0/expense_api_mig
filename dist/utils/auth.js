"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyToken = exports.signUp = exports.signIn = exports.newToken = void 0;

var _config = _interopRequireDefault(require("../config"));

var _user = require("../resources/user/user.model");

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const newToken = user => {
  return _jsonwebtoken.default.sign({
    id: user.id
  }, _config.default.secrets.jwt, {
    expiresIn: _config.default.secrets.jwtExp
  });
};

exports.newToken = newToken;

const verifyToken = token => new Promise((resolve, reject) => {
  _jsonwebtoken.default.verify(token, _config.default.secrets.jwt, (err, payload) => {
    if (err) return reject(err);
    resolve(payload);
  });
});

exports.verifyToken = verifyToken;

const signUp = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({
      message: 'need email and password'
    });
  }

  const newUser = {
    email: req.body.email,
    password: req.body.password
  };

  try {
    const user = await _user.User.create(newUser);
    const token = newToken(user);
    res.status(201).send({
      token
    });
  } catch (e) {
    console.error(e);
    res.status(500).end();
  }
};

exports.signUp = signUp;

const signIn = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({
      message: 'need email and password'
    });
  }

  const invalid = {
    message: 'invalid email and password'
  };

  try {
    const user = await _user.User.findOne({
      email: req.body.email
    }).select('email password').exec();

    if (!user) {
      return res.status(401).send(invalid);
    }

    const match = await user.checkPassword(req.body.password);

    if (!match) {
      return res.status(401).send(invalid);
    }

    const token = newToken(user); // const { id: userId } = await verifyToken(token)
    // const u = await User.findById(userId)
    // console.log(u)

    res.status(201).send({
      token
    });
  } catch (e) {
    console.error(e);
    res.status(500).end();
  }
};

exports.signIn = signIn;