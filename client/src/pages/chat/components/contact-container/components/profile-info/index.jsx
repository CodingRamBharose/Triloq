import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { getColor } from '@/lib/utils'
import { useAppStore } from '@/store'
import { HOST } from '@/utils/constants'
import React from 'react'
import { FiEdit2 as FiEdit } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

const ProfileInfo = () => {
    const { userInfo } = useAppStore()
    const navigate = useNavigate()
    return (
        <div className='absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33]'>
            <div className='flex gap-3 items-center justify-center'>
                <div className='w-12 h-12 relative  '>
                    <Avatar className="absolute h-12 w-12 overflow-hidden text-white flex items-center justify-center cursor-pointer rounded-full">
                        {
                            userInfo.image ? (<AvatarImage src={`${HOST}/${userInfo.image}`} alt="profile" className="object-cover w-full h-full" />) :
                                <div className={`h-32 w-32 text-white font-semibold text-lg flex items-center justify-center rounded-full bg-black`}>
                                    {
                                        userInfo.firstName ? userInfo.firstName.split("").shift().toUpperCase() : userInfo.email.split("").shift().toUpperCase()
                                    }
                                </div>
                        }
                    </Avatar>
                </div>
                <div>
                    {
                        userInfo.firstName && userInfo.lastName ? `${userInfo.firstName} ${userInfo.lastName}` : ""
                    }
                </div>
            </div>
            <div className='flex gap-5'>
                <Tooltip>
                    <TooltipTrigger><FiEdit className="text-green-500 text-xl font-medium" onClick={()=>navigate('/profile')} /></TooltipTrigger>
                    <TooltipContent className="bg-black border-none text-white">
                        <p>Edit Profile</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        </div>
    )
}

export default ProfileInfo
