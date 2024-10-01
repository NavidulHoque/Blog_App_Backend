import mongoose from "mongoose";

const { Schema } = mongoose

const PostSchema = new Schema({

    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
        maxLength: [100, "Title cannot exceed 100 characters"]
    },

    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true,
        minLength: [50, "Description must be at least 50 characters long"], 
    },

    photoURL: {
        type: String,
        required: [true, "Photo is required"],
    },

    categories: {
        type: [{ 
            name: { type: String, required: true }
        }],
        required: true,
        set: (categories) => {
            // Ensure unique names
            const uniqueCategories = Array.from(new Set(categories.map(category => category.trim())))
            // Assign unique IDs to each category
            return uniqueCategories.map(category => ({
                name: category
            }))
        },
        validate: {
            validator: (categories) => categories.length > 0,
            message: 'At least one category is required'
        }
    },

    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'UserID is required'],
        ref: 'User',
    }

}, { timestamps: true })

export const Post = mongoose.model('Post', PostSchema)