'use client'

import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  HStack,
  Avatar,
  AvatarBadge,
  IconButton,
  Center,
  useToast
} from '@chakra-ui/react'

import { useState, useRef } from 'react'
import userAtom from '../../atoms/userAtom'
import { useRecoilState } from 'recoil'
import usePreviewImage from '../hooks/usePreviewImage'





export default function UserProfileEdit() {

  const [user, setUser] = useRecoilState(userAtom)
  const inputref = useRef(null);
  const toast = useToast();
  const [updating, setUpdating] = useState(false);
  
  const [input, setInputs] = useState({
    name : user.name,
    username: user.username,
    email: user.email,
    bio: user.bio || "",
    password: ""
  })
  //console.log(user);
  

  //here we are destructuring the return object to get the function only
  const { handleFileChange, imgUrl } = usePreviewImage();

  const handleSubmit = async (e) =>{

    if(updating) return;
    setUpdating(true);

    e.preventDefault();
    //console.log("inside handleSubmit");
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/update/${user._id}`, {
        method: "PUT",
        credentials: "include", // This is important to send cookies with the request
        headers: {
          "Content-Type": "Application/json"
      },
        body: JSON.stringify({...input, profilePic: imgUrl})
    })

    const data = await res.json()
    //console.log(data);
    if(data.error){
      toast({
        title: "Error",
        description: "Error in updating profile",
        isClosable: true,
        status: "error"
      })
    }else{
      toast({
        title: "Success",
        description: "Profile updated Successfully",
        isClosable: true,
        status: "success"
      })
      setUser(data.user);
      localStorage.setItem("user-threads", JSON.stringify(data.user));
    }

    } catch (error) {

      toast({
        title: "Error",
        description: "Error in updating profile",
        isClosable: true,
        status: "error"
      })
      console.log(error);
      
    }finally {setUpdating(false)}
  }

  return (
    <form onSubmit = {handleSubmit}>
    <Flex
      minH={'20vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('#gray.700', '#101010')}>
      <Stack
        spacing={4}
        w={'full'}
        maxW={'md'}
        bg={useColorModeValue('white', 'gray.700')}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        my={6}
         >
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
          User Profile Edit
        </Heading>
        <FormControl  >
          <FormLabel>User Icon</FormLabel>
          <Stack direction={['column', 'row']} spacing={6}>
            <Center>
              <Avatar size="xl"  boxShadow = {"md"} src= { imgUrl || user?.profilePic } />
                
            </Center>
            <Center w="full">
              <Button w="full" onClick = {() => inputref.current.click()}>Change Avatar</Button>
              <input type = "file" hidden ref = {inputref} onChange = {handleFileChange} ></input>
            </Center>
          </Stack>
        </FormControl>
        <FormControl>
          <FormLabel>First Name</FormLabel>
          <Input
            placeholder="First Name"
            _placeholder={{ color: 'gray.500' }}
            type="text"
            value = {input.name}
            onChange = {(e) => setInputs({...input, name: e.target.value})}
          />
        </FormControl>

        <FormControl>
          <FormLabel>User name</FormLabel>
          <Input
            placeholder="UserName"
            _placeholder={{ color: 'gray.500' }}
            type="text"
            value = { input.username}
            onChange = {(e) => setInputs({...input, username: e.target.value})}
          />
        </FormControl>
        <FormControl id="email">
          <FormLabel>Email address</FormLabel>
          <Input
            value = {input.email}
            placeholder="your-email@example.com"
            _placeholder={{ color: 'gray.500' }}
            type="email"
            onChange = {(e) => setInputs({...input, email: e.target.value})}
          />

        <FormControl >
          <FormLabel>Bio</FormLabel>
          <Input
            value = {input.bio}
            placeholder="Bio"
            _placeholder={{ color: 'gray.500' }}
            type="text"
            onChange = {(e) => setInputs({...input, bio: e.target.value})}
          />
        </FormControl>

        </FormControl>
        <FormControl id="password">
          <FormLabel>Password</FormLabel>
          <Input
            placeholder="password"
            _placeholder={{ color: 'gray.500' }}
            type="password"
            onChange = {(e) => setInputs({...input, password: e.target.value})}
          />
        </FormControl>
        <Stack spacing={6} direction={['column', 'row']}>
          <Button
            bg={'red.400'}
            color={'white'}
            w="full"
            _hover={{
              bg: 'red.500',
            }}>
            Cancel
          </Button>
          <Button
            bg={'blue.400'}
            color={'white'}
            w="full"
            _hover={{
              bg: 'blue.500',
            }}
            type = "submit"
            isLoading = {updating}
            >
            Submit
          </Button>
        </Stack>
      </Stack>
    </Flex>
    </form>
  )
}