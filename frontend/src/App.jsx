import { Button } from '@chakra-ui/react'
import { Container } from '@chakra-ui/react'
import UserPage from './pages/UserPage'
import PostPage from './pages/PostPage'
import AuthPage from './pages/AuthPage'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import {useRecoilValue} from 'recoil'
import HomePage from './pages/HomePage'
import userAtom from '../atoms/userAtom'
import { Navigate } from 'react-router-dom'
import Logout from './components/Logout'
import UpdateProfilePage from './pages/UpdateProfilePage'
import CreatePost from './components/CreatePost'
 
function App() {

  const user = useRecoilValue(userAtom);
 // console.log(user);
  
  return (
    <Container maxW="620px">
      <Header />
      <Routes> 
        <Route path = "/" element = {user ? <HomePage /> : <Navigate to = "/auth" />} />
        <Route path = "/auth" element = {!user ? <AuthPage /> : <Navigate to = "/" />} />
        <Route path = '/:username' element = {user ? 
        (<><UserPage />
        <CreatePost />
        </>):
        (<UserPage />)}>

        </Route>
        {/* anything after /: is params and params can be summoned using useParams() hook in react  */}

        {/* using useParams on below url reutrns an object with every /: as key and its actual value, 
        Therfore useParams() returns an object and 
        we can destruct it according to our needs
           */}
           
        {/* {
        username: 'someUsername',
        pid: 'somePostId'
      } */}

        <Route path = '/:username/post/:pid' element = {<PostPage />} />
        <Route path = '/updateProfile' element = {<UpdateProfilePage />} />
      </Routes>

      {/* {user && <Logout />} */}
      {/* {user && <CreatePost />} */}
    </Container>
  )
}

export default App
