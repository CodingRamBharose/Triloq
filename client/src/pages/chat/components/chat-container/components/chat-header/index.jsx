import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { getColor } from '@/lib/utils';
import { useAppStore } from '@/store';
import { HOST } from '@/utils/constants';
import { RiCloseFill } from 'react-icons/ri';
const ChatHeader = () => {


  const { closeChat, selectedChatData, selectedChatType } = useAppStore();


  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20">
      <div className="flex gap-5 items-center">
        <div className="flex gap-3 items-center justify-center">
          <div className='w-12 h-12 relative'>
            {selectedChatType === "contact" ? <Avatar className="h-12 w-12 overflow-hidden cursor-pointer rounded-full">
              {
                selectedChatData.image ? (<AvatarImage src={`${HOST}/${selectedChatData.image}`} alt="profile" className="object-cover w-full h-full bg-black" />) :
                  (
                    <div className={`h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(selectedChatData.color)}`}>
                      {
                        selectedChatData.firstName ? selectedChatData.firstName.split("").shift().toUpperCase() : selectedChatData.email.split("").shift().toUpperCase()
                      }
                    </div>
                  )
              }
            </Avatar> : <div className='bg-blue-400 h-10 w-10 flex items-center justify-center rounded-full'>#</div>
            }
          </div>
        </div>
        {selectedChatType === "channel" && selectedChatData.name}
        {
          selectedChatType === "contact" && selectedChatData.firstName ? selectedChatData.firstName + " " + selectedChatData.lastName : selectedChatData.email
        }
        <div className="flex items-center justify-center gap-5">
          <button className='text-neutral-500 foucs:border-none focus:outline-none focus:text-white duration-300 transition-all cursor-pointer' onClick={closeChat}>
            <RiCloseFill className='text-3xl' />
          </button>
        </div>
      </div>


    </div>
  )
}

export default ChatHeader
