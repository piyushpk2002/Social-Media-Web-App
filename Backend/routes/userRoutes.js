import express from 'express'


import { signupUser, loginUser, logoutUser, followUnfollowUser, updateUser, getProfile } from '../controllers/userController.js'
import protectRoute from '../middlewares/protectRoute.js';
import { getFeedPosts } from '../controllers/postController.js';

const router = express.Router();

router.post("/signup", signupUser)
router.post("/login", loginUser)
router.post("/logout", logoutUser)
router.post("/follow/:id", protectRoute,followUnfollowUser)
router.put("/update/:id", protectRoute, updateUser);
router.get("/getProfile/:query", getProfile);
router.get("/feed", protectRoute, getFeedPosts)

export default router;