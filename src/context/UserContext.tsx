import { createContext, useEffect, useState, type Dispatch, type SetStateAction } from "react"
import type { userProfileType } from "../types/user.type"
import { getMyProfile } from "../services/profile.services"

export type UserContextType = {
    userDetails : userProfileType | null
    setUserDetails : Dispatch<SetStateAction<userProfileType | null>>
}
export const UserContext = createContext<UserContextType | null>(null)
export default function UserContextProvider({children} : {children :React.ReactNode}) {

    const [userDetails, setUserDetails] = useState<userProfileType | null>(null)

    async function getUserData () {
        try {
            const {data} = await getMyProfile()

            setUserDetails(data.user);
            
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        if(localStorage.getItem("token")){
            getUserData()
        }
    }, [localStorage.getItem("token")])
  return (
    <>
    <UserContext.Provider value={{userDetails , setUserDetails}}>
        {children}
    </UserContext.Provider>
    </>
  )
}
