import { User } from "../models/User.js"
import { Post } from './../models/Post.js';
import { Comment } from './../models/Comment.js';

export const updateUser = async (req, res) => {
    const { id } = req.params
    const { password, email, username } = req.body

    try {

        const updatedField = { email, username }

        if (password) {
            updatedField.password = password; 
        }

        const user = await User.findOneAndUpdate(
            { _id: id },
            updatedField,
            { new: true }
        )

        const { _id, createdAt, updatedAt } = user;
        const updatedUser = { userID: _id, username, email, createdAt, updatedAt}

        return res.json({
            status: true,
            updatedUser
        })

    } 
    
    catch (error) {

        console.error(error)
        
        return res.json({
            status: false,
            error
        })
    }

}

export const deleteUser = async (req, res) => {
    const {id} = req.params
   
    try {
        await User.findByIdAndDelete(id)
        await Post.deleteMany({userID: id})
        await Comment.deleteMany({userID: id})

        return res.json({
            status: true,
            message: "User successfully deleted!"
        })
    } 
    
    catch (error) {

        console.error(error)

        return res.json({
            status: false,
            error: {
                message: "Something went wrong, please try again"
            }
        })
    }
}

export const readUser = async (req, res) => {
    const {id} = req.params

    try {

        const user = await User.findById(id)
        const { _id, createdAt, username, email} = user
        const loggedInUser = { id: _id, createdAt, username, email}
        return res.json({
            status: true,
            loggedInUser
        })
    } 
    
    catch(error) {

        console.error(error)
        
        return res.json({
            status: false,
            error: {
                message: "Something went wrong, please reload the page to get your user information"
            }
        })
    }
}

