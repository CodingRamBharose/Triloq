
import React from 'react'

const EmptyChatContainer = () => {
  return (
    <div className='flex-1 md:bg-black md:flex flex-col justify-center items-center hidden duration-1000 transition-all '>
      <div className='text-opcity-80 text-white flex flex-col gap-5 items-center mt-10 lg:text-4xl text-3xl transition-all duration-300 text-center'>
        <h3 className=''>
          Hi <span className='text-purple-500'>!</span>Welcome to 
          <span className='text-purple-500'>triloq</span> Chat App <span className='text-purple-500'>.</span>
        </h3>
      </div>
    </div>
  )
}

export default EmptyChatContainer;
