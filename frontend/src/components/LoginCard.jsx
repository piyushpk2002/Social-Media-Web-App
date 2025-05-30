'use client'

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  useToast,
} from '@chakra-ui/react'
import { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useSetRecoilState } from 'recoil'
import authScreenAtom from '../../atoms/authAtom'
import userAtom from '../../atoms/userAtom'



export default function SignupCard() {
  const [showPassword, setShowPassword] = useState(false)
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const setUser = useSetRecoilState(userAtom);
  const [loading, setLoading] = useState(false);
  //const toast = useToast()
  const [input, setInput] = useState({
    username: "",
    password: "" 
  })
  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        //this is important to send cookies with the request
        body: JSON.stringify(input)
      })

      const data = await res.json();

      if(data.error){
        console.log(error in login);
        
        
      }else{
        localStorage.setItem("user-threads", JSON.stringify(data));
        setUser(data);
      }
    } catch (error) {
      console.log(error.message);
    }finally {setLoading(false)}
  }

  return (
    <Flex
      
      align={'center'}
      justify={'center'}
      >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Login
          </Heading>
         
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.dark')}
          boxShadow={'lg'}
          w={{
            base: "full",
            sm: "400px"  //base is smaller than sm show for smalle screens above 400px and for more smaller screens its full width
          }}
          p={8}>
          <Stack spacing={4}>
            
            <FormControl  isRequired>
              <FormLabel>Username</FormLabel>
              <Input type="email" onChange = {(e) => setInput({...input, username: e.target.value})} />
            </FormControl>
            <FormControl  isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input type={showPassword ? 'text' : 'password'} onChange = {(e) => setInput({...input, password: e.target.value})} />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => setShowPassword((showPassword) => !showPassword)}>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
              loadingText = "Logging in"
              isLoading = {loading}
              onClick = {handleLogin}
                size="lg"
                bg={useColorModeValue('gray.600', 'gray.700')}
                color={'white'}
                _hover={{
                  bg: useColorModeValue('gray.700', 'gray.800'),
                }}>
                Login
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Don't have an account <Link color={'blue.400'} onClick={() => setAuthScreen("Signup")}>Sign up</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}