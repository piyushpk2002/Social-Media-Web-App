import React, { useEffect, useState } from 'react'
import UserHeader from '../components/UserHeader'
import UserPost from '../components/UserPost'
import { useParams } from 'react-router-dom'
import { Spinner, useToast, Flex, Text } from '@chakra-ui/react'
import Post from '../components/Post'
import useGetUserProfile from '../hooks/useGetUserProfile'
import { useRecoilState } from 'recoil'
import postAtom from '../../atoms/postAtom'


const UserPage = () => {

  const {user, loading} = useGetUserProfile();
  //const toast = useToast();
  
  const [userPosts, setUserPosts] = useRecoilState(postAtom);
  //useParams helps us to extract param values from the url which in our case is the username
  const {username} = useParams();
  useEffect(() =>{

      const getUserPosts = async () =>{
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/getUserPosts/` + username, {
            credentials: "include"
          });
          const data = await res.json();
          console.log(data);
          

          if(data.error){
            console.log("error in fetching user posts");
            
// toast({
//               title: "Error",
//               description: "Error in fetching user posts",
//               isClosable: true,
//               status: "error"
//             })
          }

          //console.log("data ", data);
          setUserPosts(data);
          
        } catch (error) {
          console.log("error in fetching user posts");
          

          // toast({
          //     // title: "Error",
          //     // description: "Error in fetching user posts",
          //     // isClosable: true,
          //     // status: "error"
          //   })

        }
      }

      getUserPosts();

  }, [username, setUserPosts])

  console.log(user);
  
  if(!user && loading){
    return (<Flex justifyContent = {"center"} ><Spinner size = {"xl"}></Spinner></Flex>)
  }

  if(!user && !loading){
    return (<Flex justifyContent = {"center"} >User Not Found</Flex>)
  }

  

  return (
    <>
  
        <UserHeader user = {user} />

        {userPosts.length === 0 && (<Flex>
            <Text>There are no post to be shown</Text>
          </Flex>)}

        {userPosts && (userPosts.map((post)=>(
          <Post key = {post._id} post = {post} postedBy={post.postedBy}></Post>
        )))}
    </>
  )
}

export default UserPage