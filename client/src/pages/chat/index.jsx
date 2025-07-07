import { useAppStore } from "@/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Chat = () => {
  const { userInfo } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast("Please complete your profile setup to continue.");
      navigate("/profile");
    }
  }, [userInfo, navigate]);

  return (
    <div>
      <h1>Chat Page</h1>
    </div>
  )
}

export default Chat
