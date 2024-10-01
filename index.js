import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import authRoute from './routes/auth.js'
import UserRoute from './routes/user.js'
import PostRoute from './routes/post.js'
import CommentRoute from './routes/comment.js'

const app = express()

//middlewares
dotenv.config()
app.use(express.json())
app.use(cors({origin: "http://localhost:5173", credentials: true}))
app.use(cookieParser())
app.use("/auth", authRoute)
app.use("/user", UserRoute)
app.use("/post", PostRoute)
app.use("/comment", CommentRoute)

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

    app.listen(process.env.PORT, () => {
        console.log(`App listening on port ${process.env.PORT}`)
    });
}

startServer()