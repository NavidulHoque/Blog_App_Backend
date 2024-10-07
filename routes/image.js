import express from 'express'
import { deleteImage, uploadImage } from '../controller/image.js'
import { protect } from '../controller/auth.js'

const router = express.Router()

router.post('/upload', protect, uploadImage)

router.delete('/delete/:photo', protect, deleteImage)

export default router