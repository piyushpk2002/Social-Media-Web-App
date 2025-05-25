import React from 'react'
import { useToast } from '@chakra-ui/react'

const useToast = ({title, status, description, isClosable}) => {
  return (
    useToast({
      title: title || "Notification",
      status: status || "info",
      description: description || "",
      isClosable: isClosable !== undefined ? isClosable : true,
      duration: 5000, // Default duration of 5 seconds
    })
  )
}

export default useToast