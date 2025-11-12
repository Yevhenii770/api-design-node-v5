import { Router } from 'express'
const router = Router()

router.post('/register', (req, res) => {
  res.status(201).json({ message: 'User sign up successfully' })
})

router.post('/login', (req, res) => {
  res.status(201).json({ message: 'User logged in successfully' })
})

export default router
