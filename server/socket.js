import { Server as socketIoServer } from "socket.io";
import Message from "./models/MessagesModel.js";
import Channel from "./models/ChannelModel.js";


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

    const sendMessage = async (message) => {
        const senderSocketId = userSocketMap.get(message.sender);
        const recipientSocketId = userSocketMap.get(message.recipient);

        const createMessage = await Message.create(message);

        const messageData = await Message.findById(createMessage._id)
            .populate("sender", "id email firstName lastName image color")
            .populate("recipient", "id email firstName lastName image color");

        if (recipientSocketId) {
            io.to(recipientSocketId).emit("receiveMessage", messageData);
        }

        if (senderSocketId) {
            io.to(senderSocketId).emit("receiveMessage", messageData);
        }
    }

    const sendChannelMessage = async (message) => {
        const { sender, channelId, content, fileUrl, timestamp, messageType } = message;

        const createMessage = await Message.create({
            sender,
            recipient: null, // Channels do not have a recipient
            content,
            fileUrl,
            timestamp: new Date() || timestamp,
            messageType,
        })

        const messageData = await Message.findById(createMessage._id)
            .populate("sender", "id email firstName lastName image color")
            .exec();


        await Channel.findByIdAndUpdate(channelId, {
            $push: { messages: createMessage._id }
        })

        const channel = await Channel.findById(channelId)
            .populate("members");

        const finalData = { ...messageData._doc, channelId: channel._id };


        if (channel && channel.members) {
            channel.members.forEach(member => {
                const memberSocketId = userSocketMap.get(member._id.toString());
                if (memberSocketId) {
                    io.to(memberSocketId).emit("receiveChannelMessage", finalData);
                }
            });
            const adminSocketId = userSocketMap.get(channel.admin._id.toString());
            if (adminSocketId) {
                io.to(adminSocketId).emit("receiveChannelMessage", finalData);
            }
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
        socket.on("sendChannelMessage", sendChannelMessage);

        socket.on("disconnect", () => disconnect(socket));
    });
}



export default setupSocket;