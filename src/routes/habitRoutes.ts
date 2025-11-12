import e, { Router } from 'express'
import {
  validateBody,
  validateParams,
  validateQuery,
} from '../middleware/validation.ts'
import { z } from 'zod'

const createHabitSchema = z.object({
  name: z.string(),
})
const completeParamsSchema = z.object({
  id: z.string().max(3),
})

const router = Router()

router.get('/', (req, res) => {
  res.status(200).json({ message: 'List of habits' })
})

router.get('/:id', (req, res) => {
  res.status(200).json({ message: `One habbit ${req.params.id}` })
})

router.post('/', validateBody(createHabitSchema), (req, res) => {
  res.status(201).json({ message: 'Habbit created successfully' })
})

router.delete('/:id', (req, res) => {
  res
    .status(200)
    .json({ message: `Habbit ${req.params.id} deleted successfully` })
})

router.post(
  '/:id/complete',
  validateParams(completeParamsSchema),
  validateBody(createHabitSchema),
  (req, res) => {
    return res
      .status(200)
      .json({ message: `Habbit ${req.params.id} marked as complete` })
  }
)

export default router
