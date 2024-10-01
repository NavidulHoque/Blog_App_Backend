import { Post } from './../models/Post.js';
import { Comment } from './../models/Comment.js';

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

        const { _id, createdAt, updatedAt, title, description, photoURL, categories, userID } = populatedPost

        const { username, email } = userID

        const userInfo = { userID: userID._id, username, email }

        const post = { postID: _id, title, description, photoURL, categories, userInfo, createdAt, updatedAt }

        return res.json({
            status: true,
            post
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

        const { _id, createdAt, updatedAt, title, description, photoURL, categories, userID } = populatedPost

        const { username, email } = userID

        const userInfo = { userID: userID._id, username, email }

        const post = { postID: _id, title, description, photoURL, categories, userInfo, createdAt, updatedAt }

        return res.json({
            status: true,
            post
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
        await Post.findByIdAndDelete(id)
        await Comment.deleteMany({ postID: id })

        return res.json({
            status: true,
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

        const { _id, createdAt, updatedAt, title, description, photoURL, categories, userID } = populatedPost

        const { username, email } = userID

        const userInfo = { userID: userID._id, username, email }

        const post = { postID: _id, title, description, photoURL, categories, userInfo, createdAt, updatedAt }

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
                status: false,
                message: "No posts found"
            })
        }

        posts = await Promise.all(posts.map(async (post) => {

            const populatedPost = await post.populate('userID')

            const { _id, createdAt, updatedAt, title, description, photoURL, categories, userID } = populatedPost

            const { username, email } = userID

            const userInfo = { userID: userID._id, username, email }

            const modifiedPost = { postID: _id, title, description, photoURL, categories, userInfo, createdAt, updatedAt }

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
                status: false,
                message: "No posts found"
            })
        }

        posts = await Promise.all(posts.map(async (post) => {

            const populatedPost = await post.populate('userID')

            const { _id, createdAt, updatedAt, title, description, photoURL, categories, userID } = populatedPost

            const { username, email } = userID

            const userInfo = { userID: userID._id, username, email }

            const modifiedPost = { postID: _id, title, description, photoURL, categories, userInfo, createdAt, updatedAt }

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