export const getOne = (model) => async (req, res) => {
  try {
    const doc = await model
      .findOne({
        createdBy: req.user._id,
        _id: req.params.id,
      })
      .lean()
      .exec()

    if (!doc) {
      return res.status(404).end()
    }

    res.status(200).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const getMany = (model) => async (req, res) => {
  try {
    const docs = await model.find({ createdBy: req.user._id }).lean().exec()
    res.status(200).json({ data: docs })
  } catch (e) {
    res.status(400).end()
  }
}

export const createOne = (model) => async (req, res) => {
  const createdBy = req.user._id

  try {
    const doc = await model.create({ ...req.body, createdBy })
    res.status(201).json({ data: doc })
  } catch (e) {
    console.error(e?.code)
    if (e.code === 11000) {
      updateOneByName(model)(req, res)
      return
    }
    res.status(400).end()
  }
}

export const updateOneByName = (model) => async (req, res) => {
  try {
    const doc = await model
      .findOne({ createdBy: req.user._id, name: req.body.name })
      .lean()
      .exec()
    if (req.body.amount) {
      req.body.amount = doc.amount + req.body.amount
      console.log(req.body.amount)
    }
    const updatedDoc = await model
      .findOneAndUpdate({ createdBy: req.user._id, _id: doc._id }, req.body, {
        new: true,
      })
      .lean()
      .exec()
    if (!updatedDoc) return res.status(400).end()
    console.log(updatedDoc)
    res.status(200).send({ data: updatedDoc })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const updateOne = (model) => async (req, res) => {
  try {
    const updatedDoc = await model
      .findOneAndUpdate(
        { createdBy: req.user._id, _id: req.params.id },
        req.body,
        { new: true }
      )
      .lean()
      .exec()

    if (!updatedDoc) {
      return res.status(400).end()
    }

    res.status(200).json({ data: updatedDoc })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const removeOne = (model) => async (req, res) => {
  try {
    const removedDoc = await model.findOneAndRemove({
      _id: req.params.id,
      createdBy: req.user._id,
    })

    if (!removedDoc) {
      return res.status(400).end()
    }

    res.status(200).json({ data: removedDoc })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const crudControllers = (model) => ({
  removeOne: removeOne(model),
  updateOne: updateOne(model),
  getOne: getOne(model),
  getMany: getMany(model),
  createOne: createOne(model),
})
