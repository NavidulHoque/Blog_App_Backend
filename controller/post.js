import { Post } from './../models/Post.js';
import { Comment } from './../models/Comment.js';
import { io } from '../index.js';

export const createPost = async (req, res) => {

    try {

        const newPost = new Post({
            title: req.body.title,
            description: req.body.description,
            photoURL: req.body.photoURL,
            categories: req.body.categories,
            userID: req.body.userID
        })

        const savedPost = await newPost.save()

        const populatedPost = await savedPost.populate('userID')

        const { _id, title, description, photoURL, userID, updatedAt } = populatedPost

        const { username } = userID

        const userInfo = { username }

        const post = { postID: _id, title, description, photoURL, userInfo, updatedAt }

        io.emit('newPost', post)

        return res.json({
            status: true,
            message: "Post created successfully",
            post
        })
    }

    catch (error) {
        console.error(error)

        return res.json({
            status: false,
            message: "Something went wrong, please try again",
        })
    }
}

export const updatePost = async (req, res) => {

    const { id } = req.params

    try {

        const updatedPost = await Post.findByIdAndUpdate(id, {

            title: req.body.title,
            description: req.body.description,
            photoURL: req.body.photoURL,
            categories: req.body.categories

        }, { new: true })

        const populatedPost = await updatedPost.populate('userID')

        const { _id, updatedAt, title, description, photoURL, categories, userID } = populatedPost

        const { username } = userID

        const userInfo = { userID: userID._id, username }

        const post = { postID: _id, title, description, photoURL, categories, userInfo, updatedAt }

        io.emit('updatePost', post)

        return res.json({
            status: true,
            post,
            message: "Post updated"
        })

    }

    catch (error) {
        console.error(error)

        return res.json({
            status: false,
            message: "Something went wrong, please try again"
        })
    }
}

export const deletePost = async (req, res) => {
    const { id } = req.params

    try {

        const deletedPost = await Post.findByIdAndDelete(id)

        await Comment.deleteMany({ postID: id })

        io.emit('deletePost', deletedPost)

        return res.json({
            status: true,
            photoURL: deletedPost.photoURL,
            message: "Post successfully deleted!"
        })
    }

    catch (error) {
        console.error(error)

        return res.json({
            status: false,
            message: "Something went wrong, please try again"
        })
    }
}

export const readPostByID = async (req, res) => {
    const { id } = req.params

    try {

        const readPost = await Post.findById(id)

        const populatedPost = await readPost.populate('userID')

        const { _id, updatedAt, title, description, photoURL, categories, userID } = populatedPost

        const { username } = userID

        const userInfo = { userID: userID._id, username }

        const post = { postID: _id, title, description, photoURL, categories, userInfo, updatedAt }

        return res.json({
            status: true,
            post
        })
    }

    catch (error) {
        console.error(error)

        return res.json({
            status: false,
            message: "Something went wrong, please reload the page"
        })
    }
}

export const readPostsOfLoggedInUser = async (req, res) => {
    const { userID } = req.params
    const query = req.query

    try {
        const searchFilter = query.search
            ? { userID, title: { $regex: query.search, $options: "i" } }
            : { userID }

        let posts = await Post.find(searchFilter)

        if (posts.length === 0) {
            return res.json({
                status: false
            })
        }

        posts = await Promise.all(posts.map(async (post) => {

            const populatedPost = await post.populate('userID')

            const { _id, updatedAt, title, description, photoURL, userID } = populatedPost

            const { username } = userID

            const userInfo = { username }

            const modifiedPost = { postID: _id, title, description, photoURL, userInfo, updatedAt }

            return modifiedPost
        }))

        return res.json({
            status: true,
            posts
        })
    }

    catch (error) {
        console.error(error)

        return res.json({
            status: false,
            message: "Something went wrong, please reload the page"
        })
    }
}

export const readAllPosts = async (req, res) => {

    const query = req.query

    try {
        const searchFilter = query.search
            ? { title: { $regex: query.search, $options: "i" } }
            : {}

        let posts = await Post.find(searchFilter)

        if (posts.length === 0) {
            return res.json({
                status: false
            })
        }

        posts = await Promise.all(posts.map(async (post) => {

            const populatedPost = await post.populate('userID')

            const { _id, updatedAt, title, description, photoURL, userID } = populatedPost

            const { username } = userID

            const userInfo = { username }

            const modifiedPost = { postID: _id, title, description, photoURL, userInfo, updatedAt }

            return modifiedPost
        }))

        return res.json({
            status: true,
            posts
        })
    }

    catch (error) {
        console.error(error)

        return res.json({
            status: false,
            message: "Something went wrong, please reload the page"
        })
    }
}