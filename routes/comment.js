import express from 'express'
import { createComment, deleteComment, readCommentsByPostID, updateComment } from '../controller/comment.js'
import { protect } from '../controller/auth.js'

const router = express.Router()

//create
router.post("/create", protect, createComment)

//update
router.put("/:id", protect, updateComment)

//delete
router.delete("/:id", protect, deleteComment)

//read
router.get("/:postID", protect, readCommentsByPostID)

export default router