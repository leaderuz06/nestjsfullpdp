import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { cwd } from 'process';
import * as fs from 'fs';
import { diskStorage } from 'multer';

@Injectable()
export class UploadService {

    createMulterOptions(folder: string){
        const uploadPath = join(cwd(), 'uploads', folder);
        if(!fs.existsSync(uploadPath)){
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        return {
            storage: diskStorage({
                destination: uploadPath,
                filename: (req, file, cb) => {
                    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    cb(null, uniqueName + '-' + file.originalname);
                }
            }),
            fileFilter:(req, file, cb) => {
                if(!file.mimetype.match(/\/(jpg|jpeg|png|webp$)/)){
                    return cb( new Error('Only image files are allowed!'), false);
                }
                cb(null, true);
            }
        }
    }

}