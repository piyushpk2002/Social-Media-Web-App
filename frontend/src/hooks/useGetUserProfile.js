import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'

const useGetUserProfile = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const {username} = useParams(); 
  console.log(username);
  
  //const toast = useToast();

  useEffect(() => {
    const getUser = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/getProfile/${username}`, 
                {credentials: "include"});
            const data = await res.json();
            console.log("data: ", data);

            if(data.error){
                console.log("error in fetching user profile");
                // toast({
                //     title: "Error",
                //     description: "error in fetching user",
                //     isClosable: true,
                //     status: "error"
                // })
                return;
            }
            setUser(data);
            
            
        } catch (error) {
            console.log("error in fetching user profile");
            
            // toast({
            //     title: "Error",
            //     description: "error in fetching user",
            //     isClosable: true,
            //     status:"error"
            // })
            setUser(null)
        }
        setLoading(false);
    }

   console.log("user", user);
    getUser();
  }, [username])
  
  return {loading, user}
}  

 
export default useGetUserProfile