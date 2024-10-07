import { User } from "../../models/User.js"; 

export const checkUsernameEmail = async (username, email, userId = null) => {

    const usernameQuery = { username }
    const emailQuery = { email }

    if (userId) {
        usernameQuery._id = { $ne: userId }  // Exclude this user by ID
        emailQuery._id = { $ne: userId }
    }

    const existingUserByUsername = await User.findOne(usernameQuery)
    
    if (existingUserByUsername) {
        return "Username already exists. Please choose a different username."
    }

    const existingUserByEmail = await User.findOne(emailQuery)
    
    if (existingUserByEmail) {
        return "Email already exists. Please use a different email."
    }

    return false
}