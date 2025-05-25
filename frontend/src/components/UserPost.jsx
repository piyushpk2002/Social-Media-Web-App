import { Avatar, Box, Flex, Text, Image } from '@chakra-ui/react'
import React from 'react'
import { useState } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import { Link } from 'react-router-dom'
//import colorMode from '@chakra-ui/react'

import Actions from './Actions'

const UserPost = ({postImg, postTitle, likes, replies}) => {

        const [liked, setLiked] = useState(false)

    return (
        <Link to={"/markzuckerberg/post/1"}>
            <Flex gap={3} mb={4} py={5}>
                <Flex flexDirection={"column"} alignItems={"center"} gap = {2}>
                    <Avatar size="md" name="Mark Zuckerberg" src="/zuck-avatar.png"></Avatar>
                    <Box w='1px' h={"full"} bg='gray.light'></Box>
                    <Box position={"relative"} w={"full"} mt = {"6"}>

                        <Avatar size="xs"
                            name="John doe"
                            src='https://bit.ly/dan-abramov'
                            position={"absolute"}
                            top={"0px"}
                            left="15px"
                            padding={"2px"}
                        ></Avatar>

                        <Avatar size="xs"
                            name="John doe"
                            src='https://bit.ly/tioluwani-kolawole'
                            position={"absolute"}
                            bottom={"0px"}
                            right="-5px"
                            padding={"2px"}
                        ></Avatar>

                        <Avatar size="xs"
                            name="John doe"
                            src='https://bit.ly/kent-c-dodds'
                            position={"absolute"}
                            bottom={"0px"}
                            left="4px"
                            padding={"2px"}
                        ></Avatar>
                    </Box>
                </Flex>
                <Flex flex = {1} flexDirection={"column"} gap = {2} ml = {"4"}>
                    <Flex justifyContent={'space-between'} w = {"full"}>
                        <Flex w = {"full"} alignItems={"center"}>
                            <Text fontSize = {"sm"} fontWeight = {"bold"}>markZuckerberg</Text>
                            <Image src = {"/verified.png"} w = {4} h = {4} ml = {1} />
                        </Flex>
                        <Flex gap = {4} alignItems={"center"}>
                            <Text fontStyle={"sm"} color = {"gray.light"}>1d</Text>
                            <BsThreeDots></BsThreeDots>
                        </Flex>
                    </Flex>
                    <Text fontSize={"sm"} mb = {"2"}>{postTitle}</Text>
                    {postImg && (<Box borderRadius = {"6"}
                        overflow = {"hidden"}
                        boxShadow = {"1px solid"}
                        borderColor = {"gray.light"}>
                            <Image src = {postImg} w = {"full"} h = {"full"}></Image> 
                    </Box>)}

                    <Flex gap = {"3"} my = {1}><Actions  liked = {liked} setLiked={setLiked} /></Flex>

                    <Flex gap = {"2"} alignItems = {"center"}>
                        <Text fontSize = {"sm"} color = {"gray.light"}> {replies} replies</Text>
                        <Box borderRadius = {"full"} bg = {"gray.light"} w = {"0.5"} h = {"0.5"}></Box>
                        <Text fontSize = {"sm"} color = {"gray.light"}> {likes} likes</Text>
                    </Flex>
                </Flex>
            </Flex>
        </Link>
    )
}

export default UserPost