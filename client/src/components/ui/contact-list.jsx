import { useAppStore } from '@/store';
import { Avatar } from '@radix-ui/react-avatar';
import React from 'react'
import { AvatarImage } from './avatar';
import { HOST } from '@/utils/constants';
import { getColor } from '@/lib/utils';

const ContactList = ({ contacts, isChannel = false }) => {

    const { selectedChatData, selectedChatType, setSelectedChatType, setSelectedChatData, setSelectedChatMessages } = useAppStore();

    const handleContactClick = (contact) => {
        if (isChannel) setSelectedChatType("channel");
        else setSelectedChatType("contact");

        setSelectedChatData(contact);
        if (selectedChatData && selectedChatData._id !== contact._id) {
            setSelectedChatMessages([]);
        }

    }

    return (
        <div className='mt-5 '>
            {
                contacts.map((contact, index) => (
                    <div key={contact._id} className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${selectedChatData && selectedChatData._id === contact._id ? "bg-green-500 hover:bg-green-500/80" : " bg-gray-700 hover:bg-gray-700/80"}`} onClick={() => handleContactClick(contact)}>
                        <div className='flex gap-5 items-center justify-start text-neutral-300'>
                            {
                                !isChannel && <Avatar className="h-10 w-10 overflow-hidden cursor-pointer rounded-full">
                                    {
                                        contact.image ? (<AvatarImage src={`${HOST}/${contact.image}`} alt="profile" className="object-cover w-full h-full bg-black" />) :
                                            (
                                                <div className={` ${selectedChatData && selectedChatData._id === contact._id ? "bg-gray-400 border-2 border-white/50" : getColor(contact.color)}  h-10 w-10 text-lg border-[1px] flex items-center justify-center rounded-full`}>
                                                    {
                                                        contact.firstName ? contact.firstName.split("").shift().toUpperCase() : contact.email.split("").shift().toUpperCase()
                                                    }
                                                </div>
                                            )
                                    }
                                </Avatar>
                            }
                            {
                                isChannel && <div className='bg-blue-400 h-10 w-10 flex items-center justify-center rounded-full'>
                                    #
                                </div>
                            }
                            {
                                isChannel ? (<span>{contact.name}</span>) : 
                                (<span>{contact.firstName ? `${contact.firstName} ${contact.lastName}` : contact.email}</span>)
                            }

                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default ContactList
