import express from 'express'
import { deleteUser, readUser, updateUser } from '../controller/user.js'
import { protect } from '../controller/auth.js'

const router = express.Router()

//update
router.put("/:id", protect, updateUser)

//delete
router.delete("/:id", protect, deleteUser)

//read
router.get("/:id", protect, readUser)

export default router