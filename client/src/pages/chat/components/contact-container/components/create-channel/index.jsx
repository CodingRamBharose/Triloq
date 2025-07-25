import React, { useEffect } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import apiClient from "@/lib/api-client";
import { CREATE_CHANNEL_ROUTE, GET_ALL_CONTACTS_ROUTE } from "@/utils/constants.js";
import MultipleSelector from "@/components/ui/multipleselect";
import { useAppStore } from "@/store";

const CreateChannel = () => {

    const { addChannel } = useAppStore();

    const [newChannelModal, setNewChannelModal] = useState(false);
    const [allContacts, setAllContacts] = useState([]);
    const [selectedContacts, setselectedContacts] = useState([]);
    const [channelName, setChannelName] = useState("");

    useEffect(() => {
        const getData = async () => {
            const response = await apiClient.get(GET_ALL_CONTACTS_ROUTE, { withCredentials: true })
            setAllContacts(response.data.contacts)
        }
        getData();
    }, [])


    const createChannel = async () => {
        try {
            if(channelName.length >= 0 && selectedContacts.length > 0) {
                const response = await apiClient.post(CREATE_CHANNEL_ROUTE,
                    {   
                        name: channelName,
                        members: selectedContacts.map((contact) => contact.value)
                    }, 
                    {withCredentials: true}
                );
                
                if(response.status === 201) {
                    setNewChannelModal(false);
                    setChannelName("");
                    setselectedContacts([]);
                    addChannel(response.data.channel);
                }
            }
            console.log("Channel created successfully:", response.data);
        } catch (error) {
            console.error("Error creating channel:", error);
        }
    }

    return (
        <>
            <Tooltip>
                <TooltipTrigger>
                    <FaPlus className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300" onClick={() => setNewChannelModal(true)} />
                </TooltipTrigger>
                <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-2 text-white">
                    Create New Channel
                </TooltipContent>
            </Tooltip>
            <Dialog open={newChannelModal} onOpenChange={setNewChannelModal}>
                <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="flex items-center justify-center">Please fill up the details for new channel.</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div>
                        <input type="text" placeholder="channel name" className="bg-[#2c2e3b] border-none focus:outline-none rounded-md text-white w-full h-10 px-3" onChange={(e) => setChannelName(e.target.value)} value={channelName} />
                    </div>
                    <div>
                        <MultipleSelector
                            className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white"
                            defaultOptions={allContacts}
                            placeholder="search contacts"
                            value={selectedContacts}
                            onChange={setselectedContacts}
                            emptyIndicator={
                                <p className="text-center text-lg leading-10 text-gray-600">No result found</p>
                            }
                        />
                    </div>
                    <div>
                        <button className="w-full py-2 rounded-sm bg-green-500 transition-all duration-300 hover:bg-green-400" onClick={createChannel}>Creaet Channel</button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default CreateChannel;
