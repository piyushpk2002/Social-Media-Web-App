import { Flex, Spinner, useToast } from '@chakra-ui/react';
import React, { useEffect } from 'react'
import { useState } from 'react'
import Post from '../components/Post';
import { useRecoilState } from 'recoil';
import postAtom from '../../atoms/postAtom';

const HomePage = () => {
  const [feedPosts, setFeedPosts] = useRecoilState(postAtom)
  const [loading, setLoading] = useState(false);
  const toast = useToast();
 


  useEffect(() =>{
    const getFeedPosts = async () => {
      setFeedPosts([])
      setLoading(true)
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/feed`, {
          method: "GET",
          header: {
            "Content-Type": "application/json"
          },
          credentials: "include" // This is important to send cookies with the request
        })
  
        //console.log(res);
        
        const data = await res.json();
        console.log(data);
        
        if(data.error){
          toast({
            title: "Error",
            description: "Error in fetching feed Posts",
            status: "error",
            isClosable: true
          })
          return 
        }
  
        setFeedPosts(data);
        
      } catch (error) { 
        toast({
          title: "Error",
          description: "error in fetching feed posts",
          status: "error",
          isClosable: true
        })
      }finally {setLoading(false)};
    }

    getFeedPosts();
  }, [])
  

  return (
    <>
      {!loading && feedPosts.length === 0 && <h1>Follow some users to see posts </h1>}
      
      {loading && (<Flex justify = {"center"}>
        <Spinner size = {"xl"}></Spinner>
      </Flex>)}

      {feedPosts.map((post) =>(
          <Post key = {post._id} post = {post} postedBy = {post.postedBy}></Post>
      ))}
    </>
  )
}

export default HomePage