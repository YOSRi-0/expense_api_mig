import { List } from '../resources/list/list.model'

export const createTypes = async (user) => {
  console.log(user)
  try {
    const incomeType = await List.create({
      name: 'income',
      createdBy: user._id,
    })
    const expenseType = await List.create({
      name: 'expense',
      createdBy: user._id,
    })
    return { incomeId: incomeType._id, expenseId: expenseType._id }
  } catch (e) {
    throw new Error(e)
  }
}

export const getTypes = async (userId) => {
  const createdBy = userId
  try {
    const docs = await List.find({ createdBy }).lean().exec()
    let expenseId, incomeId
    docs.map((doc) => {
      if (doc.name === 'expense') {
        expenseId = doc._id
        return
      } else if (doc.name === 'income') {
        incomeId = doc._id
        return
      }
    })
    return { incomeId, expenseId }
  } catch (e) {
    throw new Error(e)
  }
}
