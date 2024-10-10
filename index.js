import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import authRoute from './routes/auth.js'
import UserRoute from './routes/user.js'
import PostRoute from './routes/post.js'
import CommentRoute from './routes/comment.js'
import { createServer } from 'node:http';
import { Server } from "socket.io"
import socketEvents from './socketEvents.js'
import connectDatabase from './connectDatabase.js'


const app = express()

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
    credentials: true
}))

app.use(cookieParser())
app.use("/auth", authRoute)
app.use("/user", UserRoute)
app.use("/post", PostRoute)
app.use("/comment", CommentRoute)


// Start server only if the database connection is successful
async function startServer() {
    await connectDatabase()

    server.listen(process.env.PORT, () => {
        console.log(`Server listening on port ${process.env.PORT}`)
    })
}

startServer()