"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = void 0;
const config = {
  secrets: {
    jwt: 'everywhere'
  },
  dbUrl: 'mongodb://localhost:27017/api-test'
};
exports.config = config;