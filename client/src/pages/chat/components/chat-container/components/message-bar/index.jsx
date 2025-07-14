import React, { use, useEffect, useRef } from 'react';
import { useState } from "react";
import { GrAttachment } from 'react-icons/gr';
import { RiEmojiStickerLine } from 'react-icons/ri';
import { IoSend } from 'react-icons/io5';
import EmojiPicker from 'emoji-picker-react';


const MessageBar = () => {

  const emojiRef = useRef(null);
  const emojiButtonRef = useRef(null);

  const [message, setMessage] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiRef.current &&
        emojiButtonRef.current &&
        !emojiRef.current.contains(event.target) &&
        !emojiButtonRef.current.contains(event.target)
      ) {
        setShowEmoji(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const handleEmojiPicker = (emoji) => {
    setMessage((prev) => prev + emoji.emoji);
  }

  const handleSendMessage = async () => {

  }

  return (
    <div className="h-[10vh] bg-[#1c1d25] flex items-center justify-center px-8 mb-6 gap-6">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
        <input type="text"
          placeholder="Enter Message"
          className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className='text-neutral-500 foucs:border-none focus:outline-none focus:text-white duration-300 transition-all cursor-pointer'>
          <GrAttachment className='text-2xl' />
        </button>
        <div className='relative'>
          <button
            ref={emojiButtonRef}
            onClick={() => setShowEmoji((prev) => !prev)}
            className="text-neutral-500 focus:outline-none focus:text-white duration-300 transition-all cursor-pointer"
          >
            <RiEmojiStickerLine className="text-2xl" />
          </button>

          <div className='absolute bottom-16 right-0' ref={emojiRef}>
            <EmojiPicker
              defaultSkinTone='1'
              searchDisabled={true}
              className='hide-scrollbar'
              theme='dark' open={showEmoji} onEmojiClick={handleEmojiPicker} autoFocusSearch={false}
            />
          </div>
        </div>
      </div>
      <button className='bg-green-500 rounded-md flex items-center justify-center p-5 foucs:border-none focus:outline-none focus:text-white duration-300 transition-all cursor-pointer hover:bg-green-500 focus:bg-green-500 '
        onClick={handleSendMessage}>
        <IoSend className='text-2xl' />
      </button>
    </div>
  )
}

export default MessageBar;
