import { Router } from 'express'
import crudControllers from './item.controller'

const router = Router()

router.route('/').get(crudControllers.getMany).post(crudControllers.createOne)

router
  .route('/:id')
  .get(crudControllers.getOne)
  .put(crudControllers.updateOne)
  .delete(crudControllers.removeOne)

export default router
