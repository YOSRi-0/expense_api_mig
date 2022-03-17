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
    return res.status(400).end()
  }
}

export const crudControllers = (model) => ({
  removeOne: () => {},
  updateOne: () => {},
  getOne: getOne(model),
  getMany: () => {},
  createOne: () => {},
})
