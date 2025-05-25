import React, { useEffect } from 'react'
import { useState } from 'react'
import { Box, VStack, Flex, Avatar, Text, MenuButton, Menu, Button } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { BsInstagram } from 'react-icons/bs'
import { CgMoreO } from 'react-icons/cg'
import { Portal, MenuList, MenuItem } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import { useRecoilValue } from 'recoil'
import userAtom from '../../atoms/userAtom'

const UserHeader = ({user}) => {

    const toast = useToast();
    const currentUser = useRecoilValue(userAtom);
    // console.log("current: ", currentUser[0]._id);
    //console.log("user: ", user.followers.includes(currentUser[0]._id));
    
   const [following, setFollowing] = useState(false);
   const [updating, setUpdating] = useState(false);

   

   useEffect(() =>{
       if(user?.followers && currentUser._id){
            
        setFollowing(user.followers.includes(currentUser._id))

    }
   }, [user, currentUser])

   
    
    const handleFollowUnfollow = async () =>{

            if(updating) return;
            setUpdating(true);

            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/follow/${user._id}`, {
                    method: "POST",
                    credentials: "include", // This is important to send cookies with the request
                    headers: {
                        "Content-Type": "application/json"
                    },
                })
                const data = await res.json();

                if(data.error){
                    console.log("error in following/unfollowing user");
                    
                    // toast({
                    //     title: "Error",
                    //     description: "Error in following/unfollowing user",
                    //     status: "error" ,
                    //     isClosable: true
                    // })
                    return
                }
                
                setFollowing(!following)
                console.log(data);
                
            } catch (error) {
                console.log(error);
                
                // toast({
                //     // title: "Error",
                //     // description: "error",
                //     // status: "error",
                //     // isClosable: true
                // })
            }finally {setUpdating(false)}
    }
    
    const copyUrl = () => {
        const currUrl = window.location.href;
        //console.log(window);
        navigator.clipboard.writeText(currUrl).then(() => {
            
        //     toast({
        //   title: 'URL copied',
        //   description: "Profile link copied to clipboard.",
        //   status: 'success',
        //   duration: 3000,
        //   isClosable: true,
        // })
            console.log("URL copied to clipboard");
            
        })
        
        
    }
    return (
        <VStack gap={4} alignItems={"start"}>
            <Flex justifyContent={"space-between"} w={"full"}>
                <Box>
                    <Text fontSize={"2xl"} fontWeight={"bold"}>
                        {user.name}
                    </Text>
                    <Flex gap={2} alignItems={"center"}>
                        <Text fontSize={"sm"}>{user.username}</Text>
                        <Text fontSize={"xs"} bg={"gray.dark"} color={"gray.light"} p={1} borderRadius={"full"}>threads.next</Text>
                    </Flex>
                </Box>
                <Box>
                    <Avatar
                        name={user.name}
                        src= {user.profilePic}
                        size={"xl"}
                    />
                </Box>
            </Flex>

            {currentUser._id === user._id && <Link to = "/updateProfile"><Button size = {"sm"}>Update Profile</Button></Link>}
            {currentUser._id !== user._id && <Button size = {"sm"} onClick={handleFollowUnfollow} isLoading = {updating}>{following?"Unfollow":"Follow"}</Button>}
            



            <Text>{user.bio} </Text>
            <Flex w={"full"} justifyContent={"space-between"}>
                <Flex gap={2} alignItems={'center'}>
                    <Text color={"gray.light"}>{user?.followers?.length} </Text>
                    <Box w="1" h="1" bg={"gray.light"} borderRadius={"full"}></Box>
                    <Link color={"gray.light"}>instragram.com</Link>
                </Flex>
                <Flex alignItems={"center"}>
                    <Box className="icon-container">
                        <BsInstagram size={24} cursor={"pointer"} />
                    </Box>
                    <Box className='icon-container'>
                        <Menu>
                            <MenuButton>
                                <CgMoreO size={24} cursor={"pointer"} />
                            </MenuButton>
                            <Portal>
                                <MenuList bg = {"gray.dark"}>
                                    <MenuItem bg = {"gray.dark"} onClick = {copyUrl}>Copy link</MenuItem>
                                </MenuList>
                            </Portal>
                        </Menu>
                    </Box>
                </Flex>
            </Flex>

            <Flex w = {"full"}>
                <Flex flex = {1} borderBottom = {"1.5px solid white"} justifyContent = {"center"} pb = "3" cursor = {"pointer"}>
                    <Text>Threads</Text>
                </Flex>
                <Flex flex = {1} borderBottom = {"1.5px solid gray"} justifyContent = {"center"} pb = "3" cursor = {"pointer"} color = {"gray.light"}>
                    <Text>Replies</Text>
                </Flex>
            </Flex>
        </VStack>
    )
}

export default UserHeader