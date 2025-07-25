import apiClient from "@/lib/api-client";
import { useAppStore } from "@/store";
import { GET_CHANNEL_MESSAGES_ROUTE, GET_MESSAGES_ROUTE, HOST } from "@/utils/constants";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { getColor } from "@/lib/utils";

const MessageContainer = () => {
  const scrollRef = useRef();

  const { userInfo, selectedChatData, selectedChatType, selectedChatMessages, setSelectedChatMessages, setFileDownloadProgress, setIsDownloadingFile } = useAppStore();

  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const getMessages = async () => {
      try {
        console.log("Fetching messages for chat:", selectedChatData._id);
        const response = await apiClient.post(GET_MESSAGES_ROUTE, { id: selectedChatData._id }, { withCredentials: true, })

        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }

      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    }

    const getChannelMessages = async () => {
      try {
        const response = await apiClient.get(`${GET_CHANNEL_MESSAGES_ROUTE}/${selectedChatData._id}`, { withCredentials: true });

        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }

      } catch (error) {
        console.error('Error fetching channel messages:', error);
      }
    }

    if (selectedChatData._id) {
      if (selectedChatType === "contact") {
        getMessages();
      } else if (selectedChatType === "channel") {
        getChannelMessages();
      }
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);



  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }

  }, [selectedChatMessages]);

  const checkImage = (filePath) => {
    const imageRegex = /\.(jpg|jpeg|png|gif|webp|svg|ico|bmp|tiff|tif)$/i;
    return imageRegex.test(filePath);
  }

  const renderMessages = () => {
    let lasDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lasDate;
      lasDate = messageDate;
      return (
        <div key={index} >
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDmMessages(message)}
          {selectedChatType === "channel" && renderChannelMessages(message)}
        </div>
      )
    })
  }


  const downloadFile = async (fileUrl) => {
    setIsDownloadingFile(true);
    setFileDownloadProgress(0);
    const response = await apiClient.get(`${HOST}/${fileUrl}`, {
      responseType: 'blob', withCredentials: true,
      onDownloadProgress: (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setFileDownloadProgress(progress);
      }
    });
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = urlBlob;
    link.setAttribute('download', fileUrl.split('/').pop());
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(urlBlob);
    setIsDownloadingFile(false);
    setFileDownloadProgress(0);
  }

  const renderDmMessages = (message) => (
    <div className={`${message.sender === selectedChatData._id ? "text-left" : "text-right"}`}>
      {
        message.messageType === "text" && (
          <div className={`${message.sender !== selectedChatData._id ? "bg-green-500/5 text-green-500/90 border-green-500/50" : "bg-[#2a2b33]/5 text-white/80 border-white/20"} border inline-block p-4 rounded my-1 max-w-[50%] break-words`}>
            {message.content}
          </div>
        )}
      {message.messageType === "file" && (
        <div className={`${message.sender !== selectedChatData._id ? "bg-green-500/5 text-green-500/90 border-green-500/50" : "bg-[#2a2b33]/5 text-white/80 border-white/20"} border inline-block p-4 rounded my-1 max-w-[50%] break-words`}>
          {checkImage(message.fileUrl) ?
            <div className="cursor-pointer" onClick={() => { setShowImage(true); setImageUrl(message.fileUrl) }}>
              <img src={`${HOST}/${message.fileUrl}`} alt="file" height={300} width={300} />
            </div> : <div className="flex items-center justify-center gap-5" >
              <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3 ">
                <MdFolderZip />
              </span>
              <span>{message.fileUrl.split("/").pop()}</span>
              <span className="bg-black/20 p-3 text-2xl rounded-full cursor-pointer transition-all duration-300 hover:bg-black/30" onClick={() => downloadFile(message.fileUrl)}>
                <IoMdArrowRoundDown />
              </span>
            </div>}
        </div>
      )}
      <div className="text-xs text-gray-600 ">
        {moment(message.timestamp).format("LT")}
      </div>
    </div>
  )

  const renderChannelMessages = (message) => {
    return (
      <div className={`mt-5 ${message.sender._id !== userInfo.id ? "text-left" : "text-right"}`}>
        {message.messageType === "text" && (
          <div className={`${message.sender._id === userInfo.id ? "bg-green-500/5 text-green-500/90 border-green-500/50" : "bg-[#2a2b33]/5 text-white/80 border-white/20"} border inline-block p-4 rounded my-1 max-w-[50%] break-words`}>
            {message.content}
          </div>
        )}
        {message.messageType === "file" && (
          <div className={`${message.sender._id === userInfo.id ? "bg-green-500/5 text-green-500/90 border-green-500/50" : "bg-[#2a2b33]/5 text-white/80 border-white/20"} border inline-block p-4 rounded my-1 max-w-[50%] break-words`}>
            {checkImage(message.fileUrl) ?
              <div className="cursor-pointer" onClick={() => { setShowImage(true); setImageUrl(message.fileUrl) }}>
                <img src={`${HOST}/${message.fileUrl}`} alt="file" height={300} width={300} />
              </div> : <div className="flex items-center justify-center gap-5" >
                <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3 ">
                  <MdFolderZip />
                </span>
                <span>{message.fileUrl.split("/").pop()}</span>
                <span className="bg-black/20 p-3 text-2xl rounded-full cursor-pointer transition-all duration-300 hover:bg-black/30" onClick={() => downloadFile(message.fileUrl)}>
                  <IoMdArrowRoundDown />
                </span>
              </div>}
          </div>
        )}
        {message.sender._id !== userInfo.id ? <div className="flex items-center justify-start gap-3">
          <Avatar className="h-8 w-8 overflow-hidden cursor-pointer rounded-full">
            {message.sender.image && (<AvatarImage src={`${HOST}/${message.sender.image}`} alt="profile" className="object-cover w-full h-full bg-black" />)}
            {(
              <AvatarFallback className={`h-8 w-8 text-lg flex items-center justify-center rounded-full ${getColor(message.sender.color)}`}>
                {message.sender.firstName ?
                  message.sender.firstName.split("").shift().toUpperCase() :
                  message.sender.email.split("").shift().toUpperCase()
                }
              </AvatarFallback>
            )}
          </Avatar>
          <span className="text-sm text-white/60 ">{`${message.sender.firstName} ${message.sender.lastName}`}</span>
          <span className="text-xs text-white/60 ">{moment(message.timestamp).format("LT")}</span>
        </div> : <div className="text-xs text-white/60 mt-1">{moment(message.timestamp).format("LT")}</div>
        }
      </div>
    )
  }


  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessages()}
      <div ref={scrollRef}></div>
      {
        showImage && <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col ">
          <div className="mt-10">
            <img src={`${HOST}/${imageUrl}`} alt="attachment" className="h-[80vh] w-full bg-cover " />
          </div>
          <div className="flex gap-5 fixed top-0 mt-5 ">
            <button className="bg-black/20 p-3 text-2xl rounded-full cursor-pointer transition-all duration-300 hover:bg-black/30" onClick={() => downloadFile(imageUrl)}>
              <IoMdArrowRoundDown />
            </button>
            <button className="bg-black/20 p-3 text-2xl rounded-full cursor-pointer transition-all duration-300 hover:bg-black/30" onClick={() => { setShowImage(false); setImageUrl(null) }} >
              <IoCloseSharp />
            </button>
          </div>
        </div>
      }
    </div>
  )
}

export default MessageContainer
