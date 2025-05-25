import User from "../models/userModel.js"
import Post from "../models/postModel.js"
import bcrypt from "bcryptjs"
import generateTokenAndSetCookie from "../utils/helpers/generateTokensAndSetCookie.js"
import { v2 as cloudinary } from 'cloudinary';
import mongoose from "mongoose";


const getProfile = async (req, res) => {

    const {query} = req.params;
   //console.log(query);
    
    let user;
    try {
        if(mongoose.Types.ObjectId.isValid(query)){
            user = await User.findOne({_id: query}).select("-password -updatedAt");
        }else{
            user = await User.findOne({username: query}).select("-password -updatedAt");
        }

         

        if(!user){
            return res.status(400).json({error: "User not found"});
        }
        return res.status(200).json(user);

    } catch (error) {

        console.log("Error in getProfile", error.message);
        return res.status(500).json({error: error.message});
        
    }
}


const signupUser = async (req, res) =>{
    try {
        const {name, email, password, username, bio} = req.body;
        const user = await User.findOne({$or:[{email}, {username}]})

        if(user){
            return res.status(400).json({error: "User already exists"});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User({
            name,
            email,
            password: hashedPassword,
            username,
            bio
        });

        await newUser.save();

        if(newUser){

            //setting cookies
             generateTokenAndSetCookie(newUser._id, res);

            res.status(201)
            .json({_id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                username: newUser.username,
                bio: newUser.bio,
                profilePic: newUser.profilePic
            });
        }else{
            res.status(400).json({error: "User not created"});
        }

    } catch (error) {
        res.status(500).json({ error: error.message});
        console.log("Error in signupUser", error.message);
        
    }
}

const loginUser = async (req, res) =>{
    try{
        const {username, password} = req.body;
        const user = await User.findOne({ username });

        if(!user){
            return res.status(400).json({error: "User not found"});
        }

        const comparePassword = await bcrypt.compare(password, user.password);

        if(!comparePassword){
            return res.status(400).json({error: "Invalid credentials"});
        }

        generateTokenAndSetCookie(user._id, res);

        return res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            bio: user.bio,
            profilePic: user.profilePic
        });
    
    }catch(error){

        console.log("Error in login", error.message);
        return res.status(500).json({error: error.message});
        
    }
}


const logoutUser = async (req, res) =>{

    try {
        res.cookie("jwt", "", {maxAge: 1})
        return res.status(200).json({message: "User logged out successfully"});
    } catch (error) {
        console.log("Error in logout", error.message);
        return res.status(500).json({error: error.message});
    }
}

const followUnfollowUser = async (req, res) => {
    try {
        const {id} = req.params;
        //console.log(req);
       // console.log(req.params);
        
        

        const userToBeUpdated = await User.findById(id);
        const currentUser = await User.findById(req.user._id);
        //console.log("currentUser", userToBeUpdated);;
        
        if(!userToBeUpdated || !currentUser){

            return res.status(400).json({error: "User not found"});
        }

        if(id === req.user._id){
            return res.status(400).json({error: "You cannot follow yourself"});
        }

        const isFollowing = currentUser.following.includes(id);

        if(isFollowing){
            await User.findByIdAndUpdate( req.user._id, { $pull: { following: id }});
            await User.findByIdAndUpdate( id, { $pull: { followers: req.user._id }});
            return res.status(201).json({message: "user unfollowed successfully"});
        }else{
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id}});
            await User.findByIdAndUpdate(req.user._id, { $push: {following: id}});
            return res.status(201).json({message: "user followed successfully"});
        }

    } catch (error) {

        console.log("Error in followUnfollowUser", error.message);
        res.status(500).json({error: error.message});
    }
}


const updateUser = async (req, res) => {

    const { name, email, username, password, bio } = req.body;
    let {profilePic} = req.body
    console.log(profilePic);
    
    const userId = req.user._id;
    // console.log(userId);
    // console.log(req.params);
    
    
    try {
        
        //when we call using this find by id, it returns a copy of the original object, but User is a class and user is a Mongoose document instance and not an plain object, so it contains features like user.save(), whilst User contains findById(), create like static functions.
        let user = await User.findById(userId);

        //if trying to update other users profile
        if(user._id.toString() !== req.params.id.toString()) return res.status(401).json({error: "Unauthorized Access"})

        if(!user){
            return res.status(400).json({error: "User not found"});
        }

        if(password){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user.password = hashedPassword;
        }



        if(profilePic){
            //already have a profile pic the destroy the old one
            if(user.profilePic){
               // console.log("inside");
                
                await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0])
            }
            const uploadResult = await cloudinary.uploader
            .upload(
                profilePic
            )
            .catch((error) => {
                console.log(error);
            });
            //console.log(uploadResult.secure_url);
            
            profilePic = uploadResult.secure_url
         
        //  console.log(uploadResult);
        }
       
       

        //for other fields
        user.name = name || user.name;
        user.email = email || user.email;
        user.username = username || user.username;
        user.profilePic = profilePic || user.profilePic;
        user.bio = bio || user.bio;
        

        user = await user.save();


        //so what happens is that we are storing username and profilePic seperately in the replies object in the post model
        //because of this when we update or change our profile pic or username, the same is not changed in replies object\
        //so using this code we are trying to update the same when the profile is updated
        
        await Post.updateMany(
            {"replies.userId": userId},//ensures that atleast one reply has the userId
            //update 
            {
                $set:{
                    "replies.$[reply].username": user.username,
                    "replies.$[reply].userProfilePic": user.profilePic    
                }
            },
            // what value $reply should have
            {arrayFilters: [{"reply.userId": userId}]}
        )


        res.status(200).json({message: "Profile updated successfully", user: user});

    } catch (error) {
        console.log("Error in updateUser", error.message);
        res.status(500).json({error: error.message});
            
    }
}
export  { signupUser, loginUser, logoutUser, followUnfollowUser, updateUser, getProfile }