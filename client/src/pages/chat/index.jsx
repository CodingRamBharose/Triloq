import { useAppStore } from "@/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ContactContainer from "./components/contact-container";
import EmptyChatContainer from "./components/empty-chat-container";
import ChatContainer from "./components/chat-container";

const Chat = () => {


  const { userInfo, selectedChatType, isUploadingFile, isDownloadingFile, fileUploadProgress, fileDownloadProgress } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast("Please complete your profile setup to continue.");
      navigate("/profile");
    }
  }, [userInfo, navigate]);

  return (
    <div className="flex h-[100vh] text-white overflow-hidden">
      {
        isUploadingFile && (
          <div className="h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-between gap-5 flex-col backdrop-blur-lg p-5">
            <p className="text-5xl animate-pulse">Uploading file... {fileUploadProgress}%</p>
          </div>
        )}
      {
        isDownloadingFile && (
          <div className="h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-between gap-5 flex-col backdrop-blur-lg p-5">
            <p className="text-5xl animate-pulse">Downloading file... {fileDownloadProgress}%</p>
          </div>
        )
      }
      <ContactContainer/>
      {
        selectedChatType === undefined ?
        <EmptyChatContainer/> : <ChatContainer/>
      }
    </div>
  )
}

export default Chat
