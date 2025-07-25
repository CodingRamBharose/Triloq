import { Router } from "express";
import { verifyToken } from "../middleware/AuthMiddleware.js";
import { getMessages, uploadFile } from "../controllers/MessagesController.js";
import multer from "multer";

const messageRoutes = Router();
const upload = multer({dest: 'uploads/files'});

messageRoutes.post("/get-messages", verifyToken, getMessages);
messageRoutes.post("/upload-file", verifyToken, upload.single('file'), uploadFile)


export default messageRoutes;