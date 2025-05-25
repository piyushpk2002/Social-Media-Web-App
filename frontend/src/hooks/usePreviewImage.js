import { useToast } from '@chakra-ui/react';
import React from 'react'
import { useState } from 'react'

const usePreviewImage = () => {
  const [imgUrl, setUrl] = useState(null);
  const toast = useToast()

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if(file && file.type.startsWith("image/")){
      const reader = new FileReader();

      reader.onloadend = () => {
        setUrl(reader.result);
      }

      reader.readAsDataURL(file);
    }else{
      
      toast({
        title: "Error",
        description: "Error in image preview",
        status: "error",
        isClosable: true
      })
      setUrl(null)

    }
  };

  //console.log(imgUrl);
  return {imgUrl, handleFileChange, setUrl};
}

export default usePreviewImage