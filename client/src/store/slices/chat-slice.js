
export const createChatSlice = (set, get) => ({
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessages: [],
    directMessagesContacts: [],
    setDirectMessagesContacts: (contacts) => set({ directMessagesContacts: contacts }),
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