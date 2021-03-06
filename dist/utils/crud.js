"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateOneByName = exports.updateOne = exports.removeOne = exports.getOne = exports.getMany = exports.crudControllers = exports.createOne = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const getOne = model => async (req, res) => {
  try {
    const doc = await model.findOne({
      createdBy: req.user._id,
      _id: req.params.id
    }).lean().exec();

    if (!doc) {
      return res.status(404).end();
    }

    res.status(200).json({
      data: doc
    });
  } catch (e) {
    console.error(e);
    res.status(400).end();
  }
};

exports.getOne = getOne;

const getMany = model => async (req, res) => {
  try {
    const docs = await model.find({
      createdBy: req.user._id
    }).lean().exec();
    res.status(200).json({
      data: docs
    });
  } catch (e) {
    res.status(400).end();
  }
};

exports.getMany = getMany;

const createOne = model => async (req, res) => {
  const createdBy = req.user._id;

  try {
    const doc = await model.create(_objectSpread(_objectSpread({}, req.body), {}, {
      createdBy
    }));
    res.status(201).json({
      data: doc
    });
  } catch (e) {
    console.error(e?.code);

    if (e.code === 11000) {
      updateOneByName(model)(req, res);
      return;
    }

    res.status(400).end();
  }
};

exports.createOne = createOne;

const updateOneByName = model => async (req, res) => {
  try {
    const doc = await model.findOne({
      createdBy: req.user._id,
      name: req.body.name
    }).lean().exec();

    if (req.body.amount) {
      req.body.amount = doc.amount + req.body.amount;
      console.log(req.body.amount);
    }

    const updatedDoc = await model.findOneAndUpdate({
      createdBy: req.user._id,
      _id: doc._id
    }, req.body, {
      new: true
    }).lean().exec();
    if (!updatedDoc) return res.status(400).end();
    console.log(updatedDoc);
    res.status(200).send({
      data: updatedDoc
    });
  } catch (e) {
    console.error(e);
    res.status(400).end();
  }
};

exports.updateOneByName = updateOneByName;

const updateOne = model => async (req, res) => {
  try {
    const updatedDoc = await model.findOneAndUpdate({
      createdBy: req.user._id,
      _id: req.params.id
    }, req.body, {
      new: true
    }).lean().exec();

    if (!updatedDoc) {
      return res.status(400).end();
    }

    res.status(200).json({
      data: updatedDoc
    });
  } catch (e) {
    console.error(e);
    res.status(400).end();
  }
};

exports.updateOne = updateOne;

const removeOne = model => async (req, res) => {
  try {
    const removedDoc = await model.findOneAndRemove({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!removedDoc) {
      return res.status(400).end();
    }

    res.status(200).json({
      data: removedDoc
    });
  } catch (e) {
    console.error(e);
    res.status(400).end();
  }
};

exports.removeOne = removeOne;

const crudControllers = model => ({
  removeOne: removeOne(model),
  updateOne: updateOne(model),
  getOne: getOne(model),
  getMany: getMany(model),
  createOne: createOne(model)
});

exports.crudControllers = crudControllers;