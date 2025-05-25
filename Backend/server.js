import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/connectDB.js';
import cookieParser from 'cookie-parser';

import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';

import { v2 as cloudinary } from 'cloudinary';

dotenv.config();


connectDB();
const app = express();

const PORT = process.env.PORT || 5000;

//middlewares
app.use(express.json({limit: "50mb"})); // to parse json data from req.body // without limit while creating a post it gives erro payload is too large
app.use(express.urlencoded({extended: true})); // to parse form data in the req.body
app.use(cookieParser()) // to parse cookies from req.headers.cookie


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

//routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes)


app.listen(5000, ()=> console.log(`Server started at http://localhost:${PORT}`));