import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import authRoute from './routes/auth.js'
import UserRoute from './routes/user.js'
import PostRoute from './routes/post.js'
import CommentRoute from './routes/comment.js'
import imageRoute from './routes/image.js'
import { createServer } from 'node:http';
import { Server } from "socket.io"
import socketEvents from './socketEvents.js'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';


const app = express()
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)


//middlewares
dotenv.config()

// socket connection
const server = createServer(app)
export const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true
    }
})

socketEvents(io)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}))

//backend allowing the frontend to have access to image folder
app.use('/images', express.static(path.join(__dirname, "/images")));
app.use(cookieParser())
app.use("/auth", authRoute)
app.use("/user", UserRoute)
app.use("/post", PostRoute)
app.use("/comment", CommentRoute)
app.use("/image", imageRoute)


// Database connection function
async function connectDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1)
    }
}


// Start server only if the database connection is successful
async function startServer() {
    await connectDatabase()

    server.listen(process.env.PORT, () => {
        console.log(`Server listening on port ${process.env.PORT}`)
    })
}

startServer()