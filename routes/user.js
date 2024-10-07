import express from 'express'
import { updateUser } from '../controller/user.js'
import { protect } from '../controller/auth.js'

const router = express.Router()

router.put("/:id", protect, updateUser)

export default router