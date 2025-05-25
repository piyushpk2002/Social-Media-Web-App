import React from 'react'
import { useSetRecoilState } from 'recoil'
import { useToast } from '@chakra-ui/react'
import userAtom from '../../atoms/userAtom'

const useLogout = () => {
    const setUser = useSetRecoilState(userAtom)
    const toast = useToast()
    const handleLogout = async () => {

        try {
            const res = await fetch("/api/users/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
            })

            const data = res.json();
            if(data.error){
                toast({
                    title: "Error",
                    description: data.error,
                    status: "error",
                    isClosable: true
                })
                return
            }else{
                
                localStorage.removeItem("user-threads")
                setUser("")

            }


        } catch (error) {
            console.log(error);  
        }
    }
        return handleLogout
}

export default useLogout