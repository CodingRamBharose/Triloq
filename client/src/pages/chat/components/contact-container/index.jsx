import React, { useEffect } from 'react'
import logo from "@/assets/triloq.png";
import Title from '@/components/ui/title';
import ProfileInfo from './components/profile-info';
import NewDM from './components/new-dm';
import apiClient from '@/lib/api-client';
import { GET_DM_CONTACTS_ROUTE } from '@/utils/constants';
import { useAppStore } from '@/store';
import ContactList from '@/components/ui/contact-list';

const ContactContainer = () => {

  const { setDirectMessagesContacts, directMessagesContacts } = useAppStore();

  useEffect(()=>{
    const getContacts = async () => {
      const response = await apiClient.get(GET_DM_CONTACTS_ROUTE, {withCredentials: true});

      if(response.data.contacts){
        setDirectMessagesContacts(response.data.contacts); 
      }
    }

    getContacts();
  },[])

  return (
    <div className='relative md:w-[35vw] lg:w-[30vw] xl:[20vh] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full '>
      <div className='flex p-3 justfy-strart items-center gap-2'>
        <img src={logo} alt='logo' className='w-15 h-15' />
        <h2 className='text-3xl font-bold'>TriloQ</h2>
      </div>
      <div className='my-2'>
        <div className='flex items-center justify-between pr-15'>
          <Title text = "Direct Messages"/>
          <NewDM/>
        </div>
        <div className='max-h-[38vh] overflow-y-auto EmojiPickerReact'>
          <ContactList contacts={directMessagesContacts} />
        </div>
      </div>
      <div className='my-3'>
        <div className='flex items-center justify-between pr-10'>
          <Title text = "Channels"/>
        </div>
      </div>
      <ProfileInfo/>
    </div>
  )
}

export default ContactContainer;