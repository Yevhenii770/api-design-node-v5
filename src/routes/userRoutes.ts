import { Router } from 'express'
const router = Router()

router.get('/', (req, res) => {
  res.json({ message: 'all users' })
})

router.get('/:id', (req, res) => {
  res.json({ message: `user with id ${req.params.id}` })
})

router.put('/:id', (req, res) => {
  res.json({ message: 'update user' })
})

router.delete('/:id', (req, res) => {
  res.json({ message: `delete user with id ${req.params.id}` })
})

export default router
