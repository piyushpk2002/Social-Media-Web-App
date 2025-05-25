import React, { useState } from 'react'
import Actions from './Actions';
import { Avatar, Box, Flex, Text, Divider } from '@chakra-ui/react'
import { BsThreeDots } from 'react-icons/bs'
import User from '../../../Backend/models/userModel';

const Comment = ({reply, lastReply}) => {

  const [liked, setLiked] = useState(false);

  return (
    <>
      <Flex gap={4} py={2} my={2} w={"full"}>
        <Avatar src={reply.userProfilePic} size={"md"} name={reply.username}></Avatar>
        <Flex gap={1} w={"full"} flexDirection={"column"}>
          <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
            <Text fontSize={"sm"} fontWeight={"bold"}>{reply.username}</Text>
          </Flex> 
            
          <Text>{reply.text}</Text>
          
        </Flex>
      </Flex>

      {!lastReply?<Divider my = {3}></Divider>:""}
          </>
  )
}

export default Comment