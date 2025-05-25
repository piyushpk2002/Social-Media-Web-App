import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'

const useGetUserProfile = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const {username} = useParams(); 

  useEffect(() => {
    const getUser = async () => {
        try {
            const res = await fetch(`/api/users/getProfile/${username}`);
            const data = await res.json();
           // console.log("data: ", data);

            if(data.error){
                toast({
                    title: "Error",
                    description: error,
                    isClosable: true,
                    status: error
                })
                return;
            }
            setUser(data);
            
        } catch (error) {
            toast({
                title: "Error",
                description: error,
                isClosable: true,
                status: error
            })
            setUser(null)
        }
    }

   //console.log("user", user);
    getUser();
  }, [username])
  
  return {loading, user}
}  

 
export default useGetUserProfile