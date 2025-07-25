
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
})