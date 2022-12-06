import { getAuth, onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const Header = () => {
    const[pageState, setPageState] = useState("Sign In")
    const location = useLocation()
    const navigate = useNavigate()
    const auth = getAuth();

    useEffect(()=> {
        onAuthStateChanged(auth,(user) =>{
            if(user){
                setPageState("Profile")
            }
                else{
                setPageState("Sign In ")
            }
    }); 
    },[auth]);
    function pathMatchRoute(route){
        if(route === location.pathname){
            return true
        }
    }
;  return (
    <div className='bg-white border-b shadow-sm sticky top-0 z-40'>
        <header className = "flex justify-between items-center px-3 max-w-6xl mx-auto" >
            <div>
                <img className='h-20 cursor-pointer' onClick={() => navigate("/")}  src = "https://www.logodesign.net/images/home-industry/real-logo-01.jpg" alt = "logo"/>
            </div>
            <div>
                <ul className='flex space-x-10'>
                    <li   onClick={() => navigate("/")} className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${
                pathMatchRoute("/") && "text-black border-b-red-500"
              }`}>Home</li>
                    <li onClick={() => navigate("/offers")} className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${
                pathMatchRoute("/offers") && "text-black border-b-red-500"
              }`}>Offers </li>
                    <li onClick={() => navigate("/profile")} className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${
                pathMatchRoute("/sign-in") || pathMatchRoute("/profile") && "text-black border-b-red-500"
              }`}>{pageState}</li>
                </ul>
            </div>
        </header>
    </div>
  )
}

export default Header