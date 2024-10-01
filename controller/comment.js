import { Comment } from './../models/Comment.js';

export const createComment = async (req, res) => {
    console.log(req.body.userID)

    try {

        const newComment = new Comment({
            comment: req.body.comment,
            postID: req.body.postID,
            userID: req.body.userID
        })

        await newComment.save()

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

        const { _id, createdAt, updatedAt, comment, userID, postID } = populatedComment

        const { username, email } = userID

        const userInfo = { userID: userID._id, username, email }

        const commentData = { commentID: _id, comment, userInfo, postID, createdAt, updatedAt }

        return res.json({
            status: true,
            commentData
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

        return res.json({
            status: true,
            message: "Comment successfully deleted!"
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

            const { _id, createdAt, updatedAt, comment, userID, postID } = populatedComment

            const { username, email } = userID

            const userInfo = { userID: userID._id, username, email }

            const modifiedComment = { commentID: _id, comment, userInfo, postID, createdAt, updatedAt }

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