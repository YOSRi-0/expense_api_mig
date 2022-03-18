"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = void 0;
const config = {
  secrets: {
    jwt: process.env.JWT_SECRET
  },
  dbUrl: 'mongodb://localhost:27017/expense_tracker_api'
};
exports.config = config;