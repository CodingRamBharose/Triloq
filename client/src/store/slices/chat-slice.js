
export const createChatSlice = (set, get) => ({
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessages: [],
    directMessagesContacts: [],
    isUploadingFile: false,
    isDownloadingFile: false,
    fileUploadProgress: 0,
    fileDownloadProgress: 0,
    channels: [],
    setChannels: (channels) => set({ channels }),
    setIsUploadingFile: (isUploading) => set({ isUploadingFile: isUploading }),
    setIsDownloadingFile: (isDownloading) => set({ isDownloadingFile: isDownloading }),
    setFileUploadProgress: (progress) => set({ fileUploadProgress: progress }),
    setFileDownloadProgress: (progress) => set({ fileDownloadProgress: progress }),
    setDirectMessagesContacts: (contacts) => set({ directMessagesContacts: contacts }),
    addChannel: (channel) => {
        const channels = get().channels;
        set({ channels: [...channels, channel] });
    },
    setSelectedChatType: (type) => set({ selectedChatType: type }),
    setSelectedChatData: (data) => set({ selectedChatData: data }),
    setSelectedChatMessages: (messages) => set({ selectedChatMessages: messages }),
    closeChat: () => set({ selectedChatType: undefined, selectedChatData: undefined, selectedChatMessages: [] }),
    addMessage: (message) => {
        const selectedChatMessages = get().selectedChatMessages;
        const selectedChatType = get().selectedChatType;
        set({
            selectedChatMessages: [...selectedChatMessages, {
                ...message,
                recipient:
                    selectedChatType === "channel" ? message.recipient : message.recipient._id,
                sender: selectedChatType === "channel" ? message.sender : message.sender._id
            }]
        })
    },
    addChannelInChannelList : (message)=>{
        const channels = get().channels;
        const data = channels.find(channel => channel._id === message.channelId);
        const channelIndex = channels.findIndex(channel => channel._id === message.channelId);
        if (channelIndex !== -1 && channelIndex !== undefined) {
            channels.splice(channelIndex, 1);
            channels.unshift(data);
        }
    },

    addContactsInDmContacts: (message) => {
        const userId = get().userInfo.id;
        const fromId = message.sender._id === userId ? message.recipient._id : message.sender._id;
        const fromData = message.sender._id === userId ? message.recipient : message.sender;
        const directMessagesContacts = get().directMessagesContacts;
        const data = directMessagesContacts.find(contact => contact._id === fromId);
        const messageIndex = directMessagesContacts.findIndex(contact => contact._id === fromId); 
        if(messageIndex !== -1 && messageIndex !== undefined) {
            directMessagesContacts.splice(messageIndex, 1);
            directMessagesContacts.unshift(data);
        }else{
            directMessagesContacts.unshift(fromData);
        }
        set({ directMessagesContacts });
    }, 
})