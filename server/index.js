import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDb from './config/connectDb.js';
import authRoutes from './routes/AuthRoutes.js';
import contactsRoutes from './routes/ContactRoutes.js';
import setupSocket from './socket.js';
import messageRoutes from './routes/MessagesRoutes.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

connectDb();

app.use(
    cors({
        origin: process.env.ORIGIN,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        credentials: true
    })
);

app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));

app.use(cookieParser());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);

app.use("/api/messages", messageRoutes);



const server = app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});


setupSocket(server);


