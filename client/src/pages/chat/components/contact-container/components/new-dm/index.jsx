import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import apiClient from "@/lib/api-client";
import { HOST, SEARCH_CONTACTS_ROUTE } from "@/utils/constants.js";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";

const NewDM = () => {

  const { setSelectedChatData, setSelectedChatType } = useAppStore();

  const [openNewContactModel, setOpenNewContactModel] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState([]);

  const searchContacts = async (query) => {
    try {
      if (query.length > 0) {
        console.log("Searching contacts with query:", query);
        const response = await apiClient.post(SEARCH_CONTACTS_ROUTE, { query }, { withCredentials: true });

        if (response.status === 200 && response.data.contacts) {
          setSearchedContacts(response.data.contacts);
        }
      } else {
        setSearchedContacts([]);
      }
    } catch (error) {
      console.error('Error searching contacts:', error);
    }
  }

  const selectNewContact = (contact) => {
    setOpenNewContactModel(false);
    setSelectedChatType("contact");
    setSelectedChatData(contact);
    setSearchedContacts([]);
  }

  return (
    <>
      <Tooltip>
        <TooltipTrigger>
          <FaPlus className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300" onClick={() => setOpenNewContactModel(true)} />
        </TooltipTrigger>
        <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-2 text-white">
          Select New Contact
        </TooltipContent>
      </Tooltip>
      <Dialog open={openNewContactModel} onOpenChange={setOpenNewContactModel}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center">Please select a contact</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <input type="text" placeholder="search contacts" className="bg-[#2c2e3b] border-none focus:outline-none rounded-md text-white w-full h-10 px-3" onChange={(e) => searchContacts(e.target.value)} />
          </div>
          {
            searchedContacts.length > 0 && (
              <ScrollArea className="h-[250px]">
                <div className="flex flex-col gap-5">
                  {
                    searchedContacts.map((contact) => (
                      <div key={contact._id} className="flex items-center gap-3 cursor-pointer" onClick={() => selectNewContact(contact)}>
                        <div className='w-12 h-12 relative'>
                          <Avatar className="h-12 w-12 overflow-hidden cursor-pointer rounded-full">
                            {
                              contact.image ? (<AvatarImage src={`${HOST}/${contact.image}`} alt="profile" className="object-cover w-full h-full bg-black" />) :
                                (
                                  <div className={`h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(contact.color)}`}>
                                    {
                                      contact.firstName ? contact.firstName.split("").shift().toUpperCase() : contact.email.split("").shift().toUpperCase()
                                    }
                                  </div>
                                )
                            }
                          </Avatar>
                        </div>
                        <div className="flex flex-col">
                          <span>{
                            contact.firstName && contact.lastName ? `${contact.firstName} ${contact.lastName}` : contact.email
                          }</span>
                          <span className="text-xs">{contact.email}</span>
                        </div>
                      </div>
                    ))
                  }
                </div>

              </ScrollArea>
            )
          }
          {
            searchedContacts.length <= 0 && <div>
              <p className="text-center text-neutral-400 mt-4">No contacts found</p>
            </div>
          }
        </DialogContent>
      </Dialog>
    </>
  )
}

export default NewDM;
