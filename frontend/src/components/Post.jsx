import { Avatar, Box, Flex, Text, Image, useToast } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
//import colorMode from '@chakra-ui/react'
import { formatDistanceToNow } from 'date-fns'
import { DeleteIcon } from '@chakra-ui/icons' 
import { useRecoilValue, useRecoilState } from 'recoil'

import Actions from './Actions'
import userAtom from '../../atoms/userAtom'
import postAtom from '../../atoms/postAtom'


const Post = ({post, postedBy}) => {

    const [liked, setLiked] = useState(false)
    const toast = useToast();
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const currentUser = useRecoilValue(userAtom);
    const [posts, setPosts] = useRecoilState(postAtom)
    ;

    useEffect(() =>{

        const getUser = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/getProfile/` + postedBy,
                    {credentials: "include"}
                );
                const data = await res.json();
               // console.log("data: ", data);

                if(data.error){
                    toast({
                        title: "Error",
                        description: "error in fetching user",
                        isClosable: true,
                        status: "error"
                    })
                    return;
                }
                setUser(data);
                
            } catch (error) {
                toast({
                    title: "Error",
                    description: "error in fetching user",
                    isClosable: true,
                    status: "error"
                })
                setUser(null)
            }
        }

       //console.log("user", user);
        getUser();
        
        
    }, [postedBy])

    const handleDeletePost = async (e) => {
        e.preventDefault();

        if(!window.confirm("Are you sure you want to delete this post")) return
    

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/delete/` + post._id, {
                method: "DELETE",
                credentials: "include", // This is important to send cookies with the request
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data = await res.json();

            console.log(data);

            if(data.error){
                toast({
                    title: "Error",
                    description: "Error in deleting post",
                    isClosable: true,
                    status: "error"
                })
                return;
            }

            setPosts(posts.filter((p) => post._id !== p._id))

            toast({
                title: "Successfully Deleted",
                description: "Post Deleted Successfully",
                isClosable: true,
                status: "success"
            })

            //navigate(`/${user.username}`)
            
        } catch (error) {
            console.log(error);
            
            toast({
                title: "Error",
                description: "error in deleting post",
                isClosable: true,
                status: "error"
            })
        }
    }

    return (
        <Link to={`/${user?.username}/post/${post?._id}`}>
            <Flex gap={3} mb={4} py={5}>
                <Flex flexDirection={"column"} alignItems={"center"} gap = {2}>
                    <Avatar size="md" name={user?.name} src={user?.profilePic}
                    onClick = {(e) => {
                        e.preventDefault()
                        navigate(`/${user.username}`);
                        
                        }}></Avatar>
                    <Box w='1px' h={"full"} bg='gray.light'></Box>
                    <Box position={"relative"} w={"full"} mt = {"6"}>

                    {(post.replies.length === 0) && <Text align = {"center"}>🥱</Text>}

                    {post.replies[0] &&
                        (<Avatar size="xs"
                            name="John doe"
                            src={post.replies[0].userProfilePic}
                            position={"absolute"}
                            top={"0px"}
                            left="15px"
                            padding={"2px"}
                        ></Avatar>)
                    }
                        {post.replies[1] &&
                        (<Avatar size="xs"
                            name="John doe"
                            src={post.replies[1].userProfilePic}
                            position={"absolute"}
                            top={"15px"}
                            right={"20px"}
                            padding={"2px"}
                        ></Avatar>)
                    }
                        {post.replies[2] &&
                        (<Avatar size="xs"
                            name="John doe"
                            src={post.replies[2].userProfilePic}
                            position={"absolute"}
                            top={"15px"}
                            right={"1px"}
                            padding={"2px"}
                        ></Avatar>)
                    }

                    </Box>
                </Flex>
                <Flex flex = {1} flexDirection={"column"} gap = {2} ml = {"4"}>
                    <Flex justifyContent={'space-between'} w = {"full"}>
                        <Flex w = {"full"} alignItems={"center"}>
                            <Text fontSize = {"sm"} fontWeight = {"bold"}
                              onClick = {(e) => {
                                e.preventDefault()
                                navigate(`/${user.username}`);
                                
                                }}
                            >{user?.username}</Text>
                            <Image src = {"/verified.png"} w = {4} h = {4} ml = {1} />
                        </Flex>
                        <Flex gap = {4} alignItems={"center"}>
                            
                            <Text fontStyle={"sm"} color = {"gray.light"} width = {36} textAlign={"right"}>{formatDistanceToNow(post.createdAt)} ago</Text>

                            {currentUser?._id === postedBy && (<DeleteIcon size = {20} onClick = {handleDeletePost}></DeleteIcon>)}

                        </Flex>
                    </Flex>
                    <Text fontSize={"sm"} mb = {"2"}>{post.text}</Text>
                    {post.img && (<Box borderRadius = {"6"}
                        overflow = {"hidden"}
                        boxShadow = {"1px solid"}
                        borderColor = {"gray.light"}>
                            <Image src = {post.img} w = {"full"} h = {"full"}></Image> 
                    </Box>)}

                    <Flex gap = {"3"} my = {1}><Actions post = {post} /></Flex>

                  
                </Flex>
            </Flex>
        </Link>
    )
}

export default Post