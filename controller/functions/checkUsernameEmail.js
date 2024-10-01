import { User } from "../../models/User.js"; 

export const checkUsernameEmail = async (username, email) => {
    const existingUserByUsername = await User.findOne({ username })
    
    if (existingUserByUsername) {
        return "Username already exists. Please choose a different username."
    }

    const existingUserByEmail = await User.findOne({ email })
    
    if (existingUserByEmail) {
        return "Email already exists. Please use a different email."
    }

    return false
}