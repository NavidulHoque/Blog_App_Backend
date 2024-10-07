import { upload } from "../multerSetup.js";
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

export const uploadImage = async (req, res) => {
    upload(req, res, function (err) {

        if (err) {

            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.json({
                    status: false,
                    message: "File is too large. Max size of image can be accepted highest 5MB."
                });
            }

            return res.json({
                status: false,
                message: err.message
            });
        }

        if (!req.file) {
            return res.json({
                status: false,
                message: "Photo is required"
            });
        }

        res.json({
            status: true,
            image: req.file.filename
        });
    })
}

export const deleteImage = async (req, res) => {

    const { photo } = req.params

    try {
        const imagePath = path.join(__dirname, '../images/', photo)

        await fs.promises.unlink(imagePath)

        return res.json({
            status: true
        })
    }

    catch (error){
        console.error(error);
        
        return res.json({
            status: false
        })
    }
}