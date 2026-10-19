import { createContext, useContext, useEffect, useState, type Dispatch, type SetStateAction } from "react"
import type { userProfileType } from "../types/user.type"
import { getMyProfile } from "../services/profile.services"
import { AuthContext } from "./AuthContext"
import toast from "react-hot-toast"
import { getErrorMessage } from "../utils/errorMessage"

export type UserContextType = {
    userDetails : userProfileType | null
    setUserDetails : Dispatch<SetStateAction<userProfileType | null>>
}
export const UserContext = createContext<UserContextType | null>(null)
export default function UserContextProvider({children} : {children :React.ReactNode}) {

    const [userDetails, setUserDetails] = useState<userProfileType | null>(null)
    const { token } = useContext(AuthContext)

    useEffect(() => {
        let isCurrentRequest = true

        if (!token) {
            void Promise.resolve().then(() => {
                if (isCurrentRequest) setUserDetails(null)
            })
            return () => {
                isCurrentRequest = false
            }
        }

        void getMyProfile()
            .then(({ data }) => {
                if (isCurrentRequest) setUserDetails(data.user)
            })
            .catch((error) => {
                // console.log(error)
                if (isCurrentRequest) {
                    toast.error(getErrorMessage(error, "Unable to load your profile. Please try again."))
                }
            })

        return () => {
            isCurrentRequest = false
        }
    }, [token])

  return (
    <>
    <UserContext.Provider value={{userDetails , setUserDetails}}>
        {children}
    </UserContext.Provider>
    </>
  )
}
