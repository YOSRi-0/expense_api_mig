import { Router } from 'express'

const router = Router()

const mockController = async (req, res) => {
  return res.send('router working')
}

router.route('/').get(mockController).post(mockController)

router
  .route('/:id')
  .get(mockController)
  .put(mockController)
  .delete(mockController)

export default router
