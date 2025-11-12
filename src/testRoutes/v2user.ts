//test route v2 user, may delete later
import { Router } from 'express'
const router = Router()

router.get('/', (req, res) => {
  res.json({ message: 'v2' })
})

export default router
