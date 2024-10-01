import mongoose from "mongoose"

const {Schema} = mongoose

const CommentSchema = new Schema({

    comment: {
        type: String,
        required: [true, "Comment is required"],
        trim: true,
    },

    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'UserID is required'],
        ref: 'User',
    },

    postID: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "PostID is required"],
        ref: 'Post',
    }

},{timestamps: true})

export const Comment = mongoose.model('Comment', CommentSchema)