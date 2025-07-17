import { Server as socketIoServer } from "socket.io";
import Message from "./models/MessagesModel.js";


const setupSocket = (server) => {



    const disconnect = (socket) => {
        console.log(`Client ${socket.id} disconnected`);
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId);
                break;
            }
        }
    }

    const io = new socketIoServer(server, {
        cors: {
            origin: process.env.ORIGIN,
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    const userSocketMap = new Map();

    const sendMessage = async(message)=>{
        const senderSocketId = userSocketMap.get(message.sender);
        const recipientSocketId = userSocketMap.get(message.recipient);

        const createMessage = await Message.create(message);

        const messageData = await Message.findById(createMessage._id)
        .populate("sender", "id email firstName lastName image color")
        .populate("recipient", "id email firstName lastName image color");

        if(recipientSocketId){
            io.to(recipientSocketId).emit("receiveMessage", messageData);
        }

        if(senderSocketId ){
            io.to(senderSocketId).emit("receiveMessage", messageData);   
        }
    }

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;

        if (userId) {
            userSocketMap.set(userId, socket.id);
            console.log(`User ${userId} connected with socket ID: ${socket.id}`);
        } else {
            console.error("User ID not provided in socket connection");
        }

        socket.on("sendMessage", sendMessage)

        socket.on("disconnect", () => disconnect(socket));
    });
}

export default setupSocket;