"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTypes = exports.createTypes = void 0;

var _list = require("../resources/list/list.model");

const createTypes = async user => {
  console.log(user);

  try {
    const incomeType = await _list.List.create({
      name: 'income',
      createdBy: user._id
    });
    const expenseType = await _list.List.create({
      name: 'expense',
      createdBy: user._id
    });
    return {
      incomeId: incomeType._id,
      expenseId: expenseType._id
    };
  } catch (e) {
    throw new Error(e);
  }
};

exports.createTypes = createTypes;

const getTypes = async userId => {
  const createdBy = userId;

  try {
    const docs = await _list.List.find({
      createdBy
    }).lean().exec();
    let expenseId, incomeId;
    docs.map(doc => {
      if (doc.name === 'expense') {
        expenseId = doc._id;
        return;
      } else if (doc.name === 'income') {
        incomeId = doc._id;
        return;
      }
    });
    return {
      incomeId,
      expenseId
    };
  } catch (e) {
    throw new Error(e);
  }
};

exports.getTypes = getTypes;