import { Button, FormControl, useColorModeValue, Text, Image, CloseButton, Flex, useToast } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react'
  import { useDisclosure } from '@chakra-ui/react'
  import { Textarea } from '@chakra-ui/react'
  import { useRef } from 'react'
import { BsImageFill } from 'react-icons/bs'
import usePreviewImage from '../hooks/usePreviewImage'
import { useRecoilState } from 'recoil'
import userAtom from '../../atoms/userAtom'
import postAtom from '../../atoms/postAtom'
import Post from './Post'
import { useParams } from 'react-router-dom'


const CreatePost = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [postText, setPostText] = useState('')
    const fileRef = useRef();
    const MAX_CHAR = 500;
    const [remainingChar, setRemaningChar] = useState(0);
    const {imgUrl, setUrl, handleFileChange} = usePreviewImage();
    const [user] = useRecoilState(userAtom); //instead use RecoilValue if you don't want a setter function 
    const [post, setPost] = useRecoilState(postAtom);
    const username = useParams();
    const [loading, setLoading] = useState(false);
   // console.log(user._id);
    
    const toast = useToast();


    const handleTextChange = async (e) =>{
        const text = e.target.value;
        if(text.length > MAX_CHAR){
            const truncated = text.slice(0, MAX_CHAR);
            setRemaningChar(0);
            setPostText(truncated)
        }else{
            setPostText(text);
            setRemaningChar(MAX_CHAR - text.length);
        }
    }

    const handleCreatePost = async ()=> {

      setLoading(true);

       try {
          const res = await fetch("/api/posts/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({postedBy: user._id, text: postText, img: imgUrl})
          })

          const data = await res.json();
          console.log(data);
          if(data.error){
            toast({
              title: "Error",
              description: data.error,
              isClosable: true,
              status: "error"
            })
        }else{

          if(username === user.username){

            setPost([data, ...post])

          }

          toast({
            title: "Success",
            description: "Post uploaded successfully",
            isClosable: true,
            status: "success"
          })
        }

        setLoading(false);

       } catch (error) {

        
          toast({
            title: "Error",
            description: error,
            isClosable: true,
            status: "error"
          })
      

       }

       onClose();
       setPostText("");
       setUrl("")

    }

    

  return (
    <>
        <Button
        position = {"fixed"}
        bottom = {10}
        right = {10}
        leftIcon = {<AddIcon />}
        bg = {useColorModeValue("gray.300", "gray,dark")}
        onClick = {onOpen}>
          Post  
        </Button>


        

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb = {6}>
           
            <FormControl>
                <Textarea 
                placeholder = 'Post content goes here...'
                onChange = {handleTextChange}
                value = {postText} />

                <Text fontSize = "xs"
                fontWeight = "bold"
                textAlign = {"right"}
                m = {"1"}
                color = {"gray.800"}>{remainingChar}/MAX_CHAR</Text>

                <input type = "file"
                hidden
                ref = {fileRef} 
                onChange = {handleFileChange}></input>

                <BsImageFill style = {{marginLeft: "5px", cursor: "pointer"}}
                size = {"16"}
                onClick = {() => fileRef.current.click()}></BsImageFill>

            </FormControl>
            
            {imgUrl && (
              <Flex mt = {5} w={"full"} position = {"relative"}>
                <Image  src = {imgUrl} alt = "selected image" />
                <CloseButton onClick = {() => setUrl("")}
                bg = {"gray.800"}
                position = {"absolute"}
                top = {2}
                right = {2}></CloseButton>
              </Flex>
            )}

          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleCreatePost} loading = {loading}>
              Post
            </Button>
            <Button variant='ghost'>Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </>
  )
}

export default CreatePost