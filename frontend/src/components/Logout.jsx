import React from 'react'
import userAtom from '../../atoms/userAtom'
import { useToast, Button } from '@chakra-ui/react'
import { useSetRecoilState } from 'recoil'
import {FiLogOut} from 'react-icons/fi'

const Logout = () => {
    const setUser = useSetRecoilState(userAtom)
    const toast = useToast()
    const handleLogout = async () => {

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
            })

            const data = res.json();
            if(data.error){
                toast({
                    title: "Error",
                    description: "Error in logging out",
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
  return (
    <>
    <Button position = "fixed" 
    top = {"30px"}
    right = {"30px"}
    size = {"20px"}
    onClick = {handleLogout}> <FiLogOut /> </Button>
    </>
  )
}

export default Logout