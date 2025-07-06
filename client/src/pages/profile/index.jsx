import { useAppStore } from "@/store";

const Profile = () => {
  const { userInfo } = useAppStore();
  return (
    <div>
      <h1>Email: {userInfo?.email}</h1>
    </div>
  )
}

export default Profile
