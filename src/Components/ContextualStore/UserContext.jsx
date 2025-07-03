  "use client"
import { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({children})=>{

    const [isUserLogedIn, setIsUserLogedIn] = useState(false)
    const [userDataResp, setUserDataResp] = useState(null)

    return <UserContext.Provider value={{isUserLogedIn, setIsUserLogedIn, userDataResp, setUserDataResp}}>
       {children}
    </UserContext.Provider>
}