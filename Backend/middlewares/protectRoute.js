import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'

const protectRoute = async (req, res, next) => {
    try {
        console.log("protectRoute middleware called");
        
        const token = req.cookies.jwt //remeber the name you provided during setting cookie and jwt should be same
        console.log("token", token);
        
        if(!token){
            return res.statue(401).json({message: 'Unauthorized'})
        }
    
        const decodeToken = await jwt.verify(token, process.env.JWT_SECRET);
        
        if(!decodeToken){
            return res.status(401).json({message: "Unauthorized"});
        }
        console.log("decodeToken", decodeToken);
        
    
        const user = await User.findById(decodeToken.userId)
        console.log(decodeToken.userId);
        
        console.log("user", user);
        
        if(!user){
            return res.status(401).json({message: "Unauthorized"})
        }
        console.log(user);
        

        req.user = user;

        next();

    } catch (error) {

        console.log("error in protectRoute middleware");
        return res.status(500).json({message: "Internal server error in protectRoute"});
        
    }
}

export default protectRoute