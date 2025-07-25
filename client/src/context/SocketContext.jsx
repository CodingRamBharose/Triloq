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
                const { selectedChatData, selectedChatType, addMessage, addContactsInDmContacts } = useAppStore.getState();

                if(selectedChatType !== undefined && selectedChatData._id ===message.sender._id || selectedChatData._id === message.recipient._id){
                    console.log("Adding message to chat:", message);
                    addMessage(message)
                }
                addContactsInDmContacts(message);
            };

            const handleReceiveChannelMessage = (message) => {
                const { selectedChatData, selectedChatType, addMessage, addChannelInChannelList } = useAppStore.getState();

                if(selectedChatType !== undefined && selectedChatData._id === message.channelId){
                    console.log("Adding channel message to chat:", message);
                    addMessage(message);
                }
                addChannelInChannelList(message);
            }


            socket.current.on("receiveMessage", handleReceiveMessage);
            socket.current.on("receiveChannelMessage", handleReceiveChannelMessage,)

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