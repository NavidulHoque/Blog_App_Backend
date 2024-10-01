import express from 'express'
import { createAnUser, loginAnUser, logoutAnUser } from '../controller/auth.js'

const router = express.Router()

//registration
router.post("/registration", createAnUser)

//login
router.post("/login", loginAnUser)

//logout
router.get("/logout", logoutAnUser)

export default router