import { useColorMode, Image, Flex, Button } from '@chakra-ui/react'
import React from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import userAtom from '../../atoms/userAtom'
import { Link } from 'react-router-dom'
import {AiFillHome} from 'react-icons/ai'
import {RxAvatar} from 'react-icons/rx'
import {FiLogOut} from 'react-icons/fi'
import useLogout from '../hooks/useLogout'
import authScreenAtom from '../../atoms/authAtom'


const Header = () => {
   const user = useRecoilValue(userAtom);
   const setAuthScreen = useSetRecoilState(authScreenAtom) 
   const handleLogout = useLogout(); 
   //console.log(user);
   
   const { colorMode, toggleColorMode}  = useColorMode()
  return <Flex justifyContent = {"space-between"} mt = {6} mb = "12">

      {!user && (<Link to = {"/auth"} onClick = {() => setAuthScreen("login")}>Login</Link>)}

      {user && (<Link to = "/">
      <AiFillHome size = {24}></AiFillHome>
      </Link>)}


      <Image 
          cursor = {"pointer"}
          alt = 'logo'
          src = {colorMode === "dark" ? "/light-logo.svg": "/dark-logo.svg"}
          w={6}
          onClick = {toggleColorMode}
      />

      {user && (<Flex alignItems={"center"} gap = {4}><Link to = {`${user.username}`}><RxAvatar size = {24} /></Link>
      <Button size = {"xs"} onClick = {handleLogout} > 
        <FiLogOut /> </Button>
      </Flex>)}

      {!user && (<Link to = {"/auth"} onClick = {() => setAuthScreen("signup")}>Signup</Link>)}
    </Flex>
      
    
  }

export default Header