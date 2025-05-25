import User from "../models/userModel.js"
import Post from "../models/postModel.js";
import { v2 as cloudinary, v2 } from 'cloudinary';


const createPost = async (req, res) => {

    try {
        const {postedBy, text} = req.body;
        //console.log(postedBy);
        
        let {img} = req.body
    
        if(!postedBy || !text){
            return res.status(400).json({error: "postedBy and text are necessary fields"});
        }
    
        const user = await User.findById(postedBy);
    
        if(!user){
            return res.status(400).json({error: "User not found"});
        }
    
        if(user._id.toString() !== req.user._id.toString()){
            return res.status(401).json({error: "You are not authorized to create this post"});
        }
    
        const maxLength = 500;
    
        if(text.length > maxLength){
            return res.status(400).json({error: `Text should be less than ${messaage} characters`})
        }

        if(img){
            const imgRes = await cloudinary.uploader.upload(img);
            img = imgRes.secure_url;
        }
    
        const newPost = await Post.create({postedBy, text, img});
    
        await newPost.save();
        return res.status(201).json(newPost);
    } catch (error) {
        console.log("Error in createPost", error.message);
        return res.status(500).json({error: error.message});
        
    }

}

const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        //console.log(req.params.id); req.params is an object and req.params.id is a string

        if(!post){
            return res.status(400).json({error: "Post not found"});
        }

        res.status(200).json(post);
        
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const deletePost = async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(400).json({error: "Post not found"});
        }

        if(post.postedBy.toString() !== req.user._id.toString()){
            return res.status(401).json({error: "You cannot delete this Post"});
        }

        if(post.img){             
             await cloudinary.uploader.destroy(post.img.split("/").pop().split(".")[0])
        }

        await Post.findByIdAndDelete(req.params.id);
        return res.status(200).json({message: "Post deleted successfully"});

    }catch(err){
        return res.status(500).json({error: err.message});
    }
}


const likeUnlikePost = async (req, res) =>{ 
    try {
        const {id: postId} = req.params;
        const userId = req.user._id;

        const post = await Post.findById(postId);

        if(!post){
            return res.status(404).json({error: "Post not found"});
        }

        const isLiked = post.likes.includes(userId);

        if(isLiked){
            //Unlike
            await Post.updateOne({_id: postId}, {$pull: {likes: userId}}) 
            return res.status(200).json({message: "Post unliked successfully"})
        }else{
            //like
             post.likes.push(userId);  // (equivalent to) (more optimized) await Post.findByIdAndUpdate(_id, {$push: { likes: userId }}) 
  

            await post.save();
            return res.status(200).json({message: "Post liked successfully"}); 
        }
        
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

const replyPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const {text} = req.body;
        const userId = req.user._id;
        const userProfilePic = req.user.profilePic
        const username = req.user.username;

        if(!text){
            return res.status(400),json({error: "Test field is required"});
        }

        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({error: "Post not found"});
        }

        const reply = {userId, text, userProfilePic, username}
        post.replies.push(reply);

        await post.save();
        //return res.status(200).json({message: "reply added successfully", post}); instead of returning message also we are only going to return post sa as to manage global state
        return res.status(200).json(reply)
        
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

const getFeedPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({error: "User not found"});
        }
        
        
        const following = user.following;

        const feedPosts = await Post.find({postedBy: {$in: following}}).sort({createAt: -1});

        return res.status(200).json(feedPosts);

    } catch (error) {
        console.log("Error in getfeedPosts");
        
        return res.status(500).json({message: error.message});
    }
}

const getUserPosts = async (req, res) =>{
    const {username} = req.params; 
    console.log(username);
    
    try {

        const user = await  User.findOne({username: username});
        //console.log("user: ", user._id);
        

        if(!user){
            console.log("User not found");
            return res.status(404).json({message:"User not found"});
        }

        const Posts = await Post.find({postedBy: user._id}).sort({createdAt: -1});
       // console.log(Posts);
        

        return res.status(200).json(Posts)

    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};


export { createPost, getPost, deletePost, likeUnlikePost , replyPost, getFeedPosts, getUserPosts};

 