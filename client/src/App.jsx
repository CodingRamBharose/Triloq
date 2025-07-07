import React, { Children, use, useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Auth from './pages/auth'
import Profile from './pages/profile'
import { useAppStore } from './store'
import Chat from './pages/chat'
import apiClient from './lib/api-client'
import { GET_USER_INFO_ROUTE } from './utils/constants'



const privateRoutes = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : children;
}

const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return !isAuthenticated ? children : <Navigate to="/chat" />
}


const App = () => {

  const {userInfo, setUserInfo} = useAppStore();
  
  const [loading, setLoading] = useState(true);


  useEffect(()=>{
      const getUserData = async () => {
        try {
          const response = await apiClient.get(GET_USER_INFO_ROUTE, {withCredentials: true});
          if(response.status === 200 && response.data.id){
            setUserInfo(response.data);
          }else{
            setUserInfo(undefined);
          }
        } catch (error) {
          setUserInfo(undefined);
          console.error("Error fetching user data:", error);
        }finally {
          setLoading(false);
        }
      }
      if(!userInfo){
        getUserData();
      }else{
        setLoading(false);
      }
  },[userInfo, setUserInfo])

  if(loading){
    return <div>Loading...</div>
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
        <Route path="/chat" element={<privateRoutes><Chat /></privateRoutes>} />
        <Route path="/profile" element={<privateRoutes><Profile /></privateRoutes>} />
        <Route path="/*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
