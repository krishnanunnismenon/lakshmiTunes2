import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOADS_FOLDER = path.join(__dirname, "../uploads");

const storage = multer.diskStorage({
    
    destination:(req,file,cb)=>{
        
        cb(null,UPLOADS_FOLDER);
    },
    filename:(req,file,cb)=>{
        cb(null,`${Date.now()}-${file.originalname}`)
    }
})

export const upload = multer({storage})