import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const {Schema} = mongoose

const UserSchema = new Schema({

    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: [true, "Username already exists"],
        trim: true,
        minLength: [5, 'Username must be at least 5 characters long'],
        maxLength: [15, 'Username cannot exceed 15 characters'],
        match: [/^[a-zA-Z0-9]+$/, 'Username can only contain alphanumeric characters (no special characters and space are allowed)'],
    },

    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, "Email already exists"],
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [8, 'Password must be at least 8 characters long'],
        match: [
            /^(?=.*\d)(?=.*[\W_]).{8,}$/,
            'Password must contain at least one number and one special character',
        ],
    },

},{timestamps: true})

UserSchema.pre('save', async function(next) {

    const hashedPassword = await bcrypt.hash(this.password, 10)
    this.password = hashedPassword
    next()
})

UserSchema.pre('findOneAndUpdate', async function(next) {

    const update = this.getUpdate()

    if (update.password) {
        const hashedPassword = await bcrypt.hash(update.password, 10)
        update.password = hashedPassword; 
    }
    
    next()
})

UserSchema.methods.comparePassword = async function(plainPassword, hashedPassword) {

    const isMatched = await bcrypt.compare(plainPassword, hashedPassword)

    return isMatched
}

export const User = mongoose.model('User', UserSchema)