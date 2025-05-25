import jwt from 'jsonwebtoken';

const generateTokensAndSetCookie = (userId, res) =>{
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: '15d'
    })

    console.log(token);
    
    res.cookie("jwt", token, {
  httpOnly: true,
  maxAge: 15 * 24 * 60 * 60 * 1000,
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  secure: true
});


    return token;

}

export default generateTokensAndSetCookie;