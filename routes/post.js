import express from 'express'
import { createPost, deletePost, readAllPosts, readPostByID, readPostsOfLoggedInUser, updatePost } from '../controller/post.js'
import { protect } from '../controller/auth.js'

const router = express.Router()

//create
router.post("/create", protect, createPost)

//update
router.put("/:id", protect, updatePost)

//delete
router.delete("/:id", protect, deletePost)

//read
router.get("/getPostByID/:id", protect, readPostByID)

router.get("/posts/:userID", protect, readPostsOfLoggedInUser)

router.get("/readAllPosts", readAllPosts)

export default router