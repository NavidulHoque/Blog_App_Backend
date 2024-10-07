import multer from 'multer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

//setting up disk storage

const storage = multer.diskStorage({

    destination: async (req, file, fn) => {

        const folderPath = path.join(__dirname, "images")

        try {
            await fs.promises.mkdir(folderPath, { recursive: true })

            fn(null, folderPath)
        }

        catch {
            fn(new Error("Something went wrong, please try again"), null);
        }
    },

    filename: (req, file, fn) => {
        fn(null, Date.now() + '-' + file.originalname)
    }
})

const fileFilter = (req, file, fn) => {

    if (file.mimetype.startsWith("image")) {
        fn(null, true)
    } 
    
    else {
        fn(new Error("Invalid file type. Only images are allowed."), false)
    }
}

export const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: fileFilter
}).single("file")