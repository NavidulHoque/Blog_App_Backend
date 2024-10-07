import { User } from "../models/User.js"
import { checkUsernameEmail } from "./functions/checkUsernameEmail.js"

export const updateUser = async (req, res) => {
    const { id } = req.params
    const { currentPassword, newPassword, email, username } = req.body

    try {

        const isDuplicate = await checkUsernameEmail(username, email, id)

        if (isDuplicate) {
            return res.json({
                status: false,
                message: isDuplicate
            })
        }

        const updatedField = { email, username }

        if (currentPassword && newPassword) {

            const user = await User.findOne({ email })

            const isMatched = await user.comparePassword(currentPassword, user.password)

            if (!isMatched) {
                return res.json({
                    status: false,
                    message: "Password invalid"
                })
            }

            updatedField.password = newPassword
        }

        const user = await User.findOneAndUpdate(
            { _id: id },
            updatedField,
            { new: true }
        )

        const { _id, createdAt, updatedAt } = user;
        const updatedUser = { id: _id, username, email, createdAt, updatedAt}

        return res.json({
            status: true,
            message: "Profile updated successfully",
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


