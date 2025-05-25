import express from 'express'

import {createPost, getPost, deletePost, likeUnlikePost, replyPost, getFeedPosts, getUserPosts} from '../controllers/postController.js'
import protectRoute from '../middlewares/protectRoute.js';


const router = express.Router();
//remeber express matches top to bottom so the order of routes matters
// if you put getFeedPosts before getPost then it will match getPost first and not run getFeedPosts, it wil
//match feed in url with /:id and run getPost first give an error
// so the order of routes matters
router.get("/feed", protectRoute, getFeedPosts);
router.get("/:id", getPost);
router.get("/getUserPosts/:username", getUserPosts)
router.post("/create", protectRoute, createPost);
router.delete("/delete/:id", protectRoute, deletePost);
router.put("/like/:id", protectRoute, likeUnlikePost);
router.put("/reply/:id", protectRoute, replyPost);



export default router
