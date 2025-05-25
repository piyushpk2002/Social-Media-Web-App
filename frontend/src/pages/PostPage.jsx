import { Avatar, Box, Flex, Text, Image, Button, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import Actions from '../components/Actions'
import { Divider, Spinner } from '@chakra-ui/react'
import Comment from '../components/Comment'
import useGetUserProfile from '../hooks/useGetUserProfile'
import { useNavigate, useParams } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { useRecoilState, useRecoilValue } from 'recoil'
import userAtom from '../../atoms/userAtom'
import { DeleteIcon } from '@chakra-ui/icons'
import postAtom from '../../atoms/postAtom'
//import { useColorMode } from '@chakra-ui/react'


const PostPage = () => {

  const { user, loading } = useGetUserProfile();
  const [post, SetPost] = useRecoilState(postAtom);
  const { pid } = useParams();
  const currentUser = useRecoilValue(userAtom);
  const toast = useToast();
  const navigate = useNavigate();

  const currentPost = post[0]


  useEffect(() => {
    const getPost = async () => {
      SetPost([])
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${pid}`,{
          credentials: "include"
        })
        const data = await res.json();
        //console.log(data);

        if (data.error) {
          toast({
            title: "Error",
            description: "Error in fetching post",
            status: "error",
            isClosable: true
          })
          return
        }

        SetPost([data]);

      } catch (error) {
        console.log(error);

        toast({
          title: "Error",
          description: "error in fetching post",
          status: "error",
          isClosable: true
        })

      }
    }

    getPost();

  }, [pid, SetPost])

    
  const handleDeletePost = async () => {
    //In post page it is required to call e.preventDefault(), bcoz it was inside a link, here it isn't
    //e.preventDefault();

    if(!window.confirm("Are you sure you want to delete this post")) return

    try {
        const res = await fetch("/api/posts/delete/" + currentPost._id, {
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
                description: data.error,
                isClosable: true,
                status: "error"
            })
            return;
        }

        toast({
            title: "Successfully Deleted",
            description: "Post Deleted Successfully",
            isClosable: true,
            status: "success"
        })


        navigate(`/${user.username}`)
        
    } catch (error) {
        console.log(error);
        
        toast({
            title: "Error",
            description: error,
            isClosable: true,
            status: "error"
        })
    }
}


  if (!currentPost) return null

  //const { colorMode, toggleColorMode}  = useColorMode()

  return (
    <>

      {
        !user && <Flex>
          <Spinner size="xl"></Spinner>
        </Flex>
      }
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar src={user?.profilePic} size={"md"} name={user?.name}></Avatar>
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>{user?.username}</Text>
            <Image src={"/verified.png"} w={4} h={4} ml={1} />
          </Flex>
        </Flex>
        <Flex alignItems={"center"} gap={4}>

          <Text fontStyle={"sm"} color={"gray.light"} width={36} textAlign={"right"}>{formatDistanceToNow(new Date(currentPost.createdAt))} ago</Text>

          {currentUser?._id === user?._id && (<DeleteIcon size={20} cursor = {"pointer"} onClick={handleDeletePost}></DeleteIcon>)}

          
        </Flex>
      </Flex>

      <Text my={3}>{currentPost?.text}</Text>
      <Box borderRadius={"6"}
        overflow={"hidden"}
        boxShadow={"1px solid"}
        borderColor={"gray.light"}>
        {currentPost?.img && <Image src={currentPost?.img} w={"full"} h={"full"}></Image>}
      </Box>

      <Flex gap={3} my={1}>
        <Actions post={currentPost} />
      </Flex>



      <Divider my={4} />

      <Flex justifyContent={"space-between"} w={"full"}>
        <Flex gap={2} alignItems={"center"} w={"full"}>
          <Text fontSize={"2xl"}>✌️</Text>
          <Text color={"gray.light"}>Get the app to like, reply and post.</Text>
        </Flex>

        <Button borderRadius={6} bg={"gray.light"} mr={4} color={"white"}>Get</Button>

      </Flex>

      <Divider my={4} />
      {currentPost.replies.map((reply) => (
        <Comment
        key = {reply._id}
        reply = {reply}
        lastReply = {reply._id === currentPost.replies[currentPost.replies.length-1]._id}
      />
      )
      )}
      

    </>
  )
}

export default PostPage