import { useAppStore } from "@/store";
import { use, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/triloq.png";
import chat from "../../assets/chat.jpg";
import conversation from "../../assets/conversation.jpg";
import emoj from "../../assets/emoj.jpg";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { colors, getColor } from "@/lib/utils";
import { FaPlus, FaTrash } from "react-icons/fa";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import { UPDATE_PROFILE_ROUTE } from "@/utils/constants";


const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);


  useEffect(()=>{
    if(userInfo && userInfo.profileSetup){
      setFirstName(userInfo.firstName || "");
      setLastName(userInfo.lastName || "");
      setSelectedColor(userInfo.color || 0);
    }
  },[userInfo]);


  const validateProfile = () => {
    if (!firstName) {
      toast.error("First name is required");
      return false;
    }
    if (!lastName) {
      toast.error("Last name is required");
      return false;
    }
    return true;
  }

  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        const response = await apiClient.post(UPDATE_PROFILE_ROUTE, { firstName, lastName, color: selectedColor }, { withCredentials: true });
        if(response.status === 200 && response.data){
          setUserInfo({...response.data});
          toast.success("Profile updated successfully");
          navigate("/chat");
        }
      } catch (error) {
        console.error("Error saving profile changes:", error);
      }
    }
  }


  return (
    <div className="h-[100vh] w-full p-10 flex items-center justify-center gap-10">

      <div className="relative w-[50%] h-full bg-[#c6e7d6] overflow-hidden border-b-[3vh] rounded-br-[30vh] border-[#376353]">
        <div className="relative w-full overflow-hidden h-full">
          <svg
            className="absolute top-0 right-[-6vw] w-[40vw] h-[55vh] bg-green-60\"
            viewBox="0 0 4651 3050"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="blobGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1F4037" />
                <stop offset="100%" stopColor="#99f2c8" />
              </linearGradient>
            </defs>
            <path
              fill="url(#blobGradient)"
              d="M3 2C-58 164 1052-73 600 624Q220 1334 1579 343 869 2019 2313 518C1907 3123 3943-1895 3943 3048 3946 0 3943 0 3943 0"
            ></path>
          </svg>
        </div>
        <div className="absolute top-0 left-16 z-10 mt-40 text-center px-4">
          <h1 className="text-5xl font-bold text-green-950">Welcome to Triloq!</h1>
          <p className="text-gray-600 mt-2 text-semibold text-lg">
            Your space to connect, express, and be heard <br /> real people, real conversations.
          </p>
          <div className="flex justify-center gap-6 mt-10">
            <img src={logo} className="w-16 h-16 rounded-full border-white border-6 shadow-lg mt-14 mr-10" />
            <img src={chat} className="w-16 h-16 rounded-full shadow-lg mt-2 border-white border-6" />
            <img src={conversation} className="w-14 h-14 rounded-full shadow-lg mt-18 ml-10 mr-10 border-white border-6" />
            <img src={emoj} className="w-16 h-16 rounded-full shadow-lg border-white border-6" />
          </div>
        </div>
      </div>

      <div className="w-[50%] h-full flex flex-col  items-center justify-center gap-2">
        <div className="h-32 w-32 relative flex items-center justify-center"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <Avatar className="absolute h-32 w-32 overflow-hidden text-white flex items-center justify-center cursor-pointer rounded-full">
            {
              image ? (<AvatarImage src={image} alt="profile" className="object-cover w-full h-full bg-black" />) :
                <div className={`h-32 w-32 text-black font-semibold text-5xl flex items-center justify-center rounded-full ${getColor(selectedColor)}`}>
                  {
                    firstName ? firstName.split("").shift().toUpperCase() : userInfo.email.split("").shift().toUpperCase()
                  }
                </div>
            }
          </Avatar>
          {
            hovered && (
              <div className="absolute flex items-center justify-center bg-black text-white w-32 h-32 rounded-full text-5xl cursor-pointer">
                {
                  image ? <FaTrash /> : <FaPlus />
                }
              </div>
            )
          }
          <input type="text" />
        </div>
        <div className="flex w-full px-10 flex-col gap-5 text-white items-center justify-center">
          <input type="email" placeholder="Email" disabled className="w-full bg-[#376353] p-2 pl-4 border rounded" value={userInfo.email} />
          <input type="text" placeholder="First Name" className="w-full bg-[#376353] p-2 pl-4 border rounded" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <input type="text" placeholder="Last Name" className="w-full bg-[#376353] p-2 pl-4 border rounded" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          <div className="w-full flex gap-5 items-center justify-center">{
            colors.map((color, index) => <div className={`${color} h-14 w-14 rounded-full cursor-pointer transition-all duration-300 ${selectedColor === index ? "outline-3 outline-[#376353] border-none" : "border-2"}`} key={index} onClick={() => setSelectedColor(index)}>
            </div>)
          }
          </div>
          <div className="w-full">
            <button type="submit" className="w-full bg-[#5C9980] font-semibold border-b-4 rounded-bl-4xl border-[#376353]  text-white p-2 rounded hover:bg-[#376353] transition-all cursor-pointer" onClick={saveChanges}>Save Changes</button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Profile
