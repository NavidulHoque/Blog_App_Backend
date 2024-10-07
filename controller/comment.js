import { io } from '../index.js';
import { Comment } from './../models/Comment.js';

export const createComment = async (req, res) => {

    try {

        const newComment = new Comment({
            comment: req.body.comment,
            postID: req.body.postID,
            userID: req.body.userID
        })

        const savedComment = await newComment.save();

        const populatedComment = await savedComment.populate('userID');

        const { _id, updatedAt, comment, userID } = populatedComment;
        
        const { username } = userID;

        const userInfo = { userID: userID._id, username }

        const commentData = { commentID: _id, comment, userInfo, updatedAt }

        io.emit('newComment', commentData)

        return res.json({
            status: true
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

export const updateComment = async (req, res) => {

    const { id } = req.params

    try {

        const updatedComment = await Comment.findByIdAndUpdate(id, {

            comment: req.body.comment,

        }, { new: true })

        const populatedComment = await updatedComment.populate('userID')

        const { _id, updatedAt, comment, userID } = populatedComment

        const { username } = userID

        const userInfo = { userID: userID._id, username }

        const updatedCommentData = { commentID: _id, comment, userInfo, updatedAt }

        io.emit('updateComment', updatedCommentData)

        return res.json({
            status: true
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

export const deleteComment = async (req, res) => {
    const { id } = req.params

    try {
        await Comment.findByIdAndDelete(id)

        const commentID = id

        io.emit('deleteComment', commentID)

        return res.json({
            status: true,
            commentID: id
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

export const readCommentsByPostID = async (req, res) => {
    const { postID } = req.params

    try {

        let comments = await Comment.find({ postID })

        comments = await Promise.all(comments.map(async (com) => {

            const populatedComment = await com.populate('userID')

            const { _id, updatedAt, comment, userID } = populatedComment

            const { username } = userID

            const userInfo = { userID: userID._id, username }

            const modifiedComment = { commentID: _id, comment, userInfo, updatedAt }

            return modifiedComment
        }))

        return res.json({
            status: true,
            comments
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