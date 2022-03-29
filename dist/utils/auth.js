"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyToken = exports.signUp = exports.signIn = exports.protect = exports.newToken = void 0;

var _config = _interopRequireDefault(require("../config"));

var _user = require("../resources/user/user.model");

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _types = require("./types");

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
    const types = await (0, _types.createTypes)(user);
    const token = newToken(user);
    return res.status(201).send({
      token,
      email: user.email,
      types
    });
  } catch (e) {
    console.error(e);
    return res.status(500).end();
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

    const types = await (0, _types.getTypes)(user._id);
    console.log(types);
    const token = newToken(user);
    return res.status(201).send({
      token,
      email: user.email,
      types
    });
  } catch (e) {
    console.error(e);
    return res.status(500).end();
  }
};

exports.signIn = signIn;

const protect = async (req, res, next) => {
  const bearer = req.headers.authorization;

  if (!bearer || !bearer.startsWith('Bearer ')) {
    return res.status(401).end();
  }

  const token = bearer.split('Bearer ')[1].trim();
  let payload;

  try {
    payload = await verifyToken(token);
  } catch (e) {
    return res.status(401).end();
  }

  const user = await _user.User.findById(payload.id).select('-password').lean().exec();

  if (!user) {
    return res.status(401).end();
  }

  req.user = user;
  next();
};

exports.protect = protect;