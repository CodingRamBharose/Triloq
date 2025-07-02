import { useState } from "react";
import sideImage from "../../assets/WEFWE.png";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const Auth = () => {

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");

const handleLogin = async() => {

}
const handleRegister = async() => {

}

  return (
    <div className="h-screen w-full flex bg-gradient-to-r from-white to-green-200 ">
      <div className="relative h-screen w-[50%] ">
        <h1 className="text-2xl pt-10 font-serif font-medium">Create your Triloq — Real people. Real talks.</h1>
      <img src={sideImage} className="absolute bottom-0 left-0 h-[70vh] rounded-br-[30vh] border-b-[20px] border-green-950" alt="" />
      </div>
      <div className="w-[50%] h-screen pt-10 pb-10 pr-10">
        <div className="border-green-950 shadow-emerald-950 shadow-2xl border-b-[3vh] rounded-bl-[30vh] h-full w-full p-10 flex itemsq justify-center">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="w-full justify-center">
              <TabsTrigger value="login" className="w-1/2 cursor-pointer data-[state=active]:!bg-transparent text-black text-opacity-90 border-b-3 data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-green-950 data-[state=active]:rounded-bl-3xl p-3 transition-all duration-300">Login</TabsTrigger>
              <TabsTrigger value="register" className="w-1/2 cursor-pointer data-[state=active]:!bg-transparent text-black text-opacity-90 border-b-3 data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-green-950 data-[state=active]:rounded-bl-3xl p-3 transition-all duration-300">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <div className="flex flex-col items-center justify-center h-full">
                <h2 className="text-xl font-semibold mb-4">Login to your account</h2>
                <form className="w-full max-w-sm">
                  <input type="email" placeholder="Email" className="w-full p-2 mb-4 border rounded" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <input type="password" placeholder="Password" className="w-full p-2 mb-4 border rounded" value={password} onChange={(e) => setPassword(e.target.value)} />
                  <button type="submit" className="w-full bg-green-500 text-white p-2 rounded" onClick={handleLogin}>Login</button>
                </form>
              </div>
            </TabsContent>
            <TabsContent value="register">
              <div className="flex flex-col items-center justify-center h-full">
                <h2 className="text-xl font-semibold mb-4">Create a new account</h2>
                <form className="w-full max-w-sm">
                  <input type="email" placeholder="Email" className="w-full p-2 mb-4 border rounded" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <input type="password" placeholder="Password" className="w-full p-2 mb-4 border rounded" value={password} onChange={(e) => setPassword(e.target.value)} />
                  <input type="password" placeholder="Confirm Password" className="w-full p-2 mb-4 border rounded" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  <button type="submit" className="w-full bg-green-500 text-white p-2 rounded" onClick={handleRegister}>Register</button>
                </form>
              </div>
            </TabsContent>
          </Tabs>

        </div>
      </div>
    </div>  
  )
}

export default Auth
