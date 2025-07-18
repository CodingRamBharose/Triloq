import { useAppStore } from '@/store';
import { HOST } from '@/utils/constants';
import React, { createContext, use, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
}

export const SocketProvider = ({ children }) => {
    const socket = useRef();
    const { userInfo } = useAppStore();

    useEffect(() => {
        if (userInfo) {
            socket.current = io(HOST, {
                withCredentials: true,
                query: {
                    userId: userInfo.id
                }
            });
            socket.current.on("connect", () => {
                console.log("Connected to socket server");
            });


            const handleReceiveMessage = (message) => {
                const { selectedChatData, selectedChatType, addMessage} = useAppStore.getState();

                if(selectedChatType !== undefined && selectedChatData._id ===message.sender._id || selectedChatData._id === message.recipient._id){
                    console.log("Adding message to chat:", message);
                    addMessage(message)
                }
                console.log("Received message:", message);
            };


            socket.current.on("receiveMessage", handleReceiveMessage);

            return ()=>{
                socket.current.disconnect();
                console.log("Disconnected from socket server");
            }
        }
    }, [userInfo])

    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    );
}