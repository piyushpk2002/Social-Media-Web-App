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
        const res = await fetch("/api/posts/feed", {
          method: "GET",
          header: {
            "Content-Type": "application/json"
          }
        })
  
        //console.log(res);
        
        const data = await res.json();
        console.log(data);
        
        if(data.error){
          toast({
            title: "Error",
            description: data.error,
            status: "error",
            isClosable: true
          })
          return 
        }
  
        setFeedPosts(data);
        
      } catch (error) { 
        toast({
          title: "Error",
          description: error,
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