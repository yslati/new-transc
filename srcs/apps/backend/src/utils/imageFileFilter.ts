import { HttpException, HttpStatus } from "@nestjs/common";
import { Request } from "express";
import { extname } from "path";

export const imageFileFilter = (req: Request, file: Express.Multer.File, callback): any => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/))
        return callback(new HttpException('Only images are supported', HttpStatus.FORBIDDEN), false);
    return callback(null, true);
}

export const editFileName = (req: any, file: Express.Multer.File, callback): any => {
    const fileExt = extname(file.originalname);
    const newFile = req.user.user + fileExt;

    callback(null, newFile);
}