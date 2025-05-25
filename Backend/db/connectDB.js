import mongoose from "mongoose"

const connectDB = async () => {
    try {
        //since db is far, alway remember to use async and await
            const conn =  await mongoose.connect(process.env.MONGO_URI, {
            //to avoid warnings in the console
            useNewUrlParser: true,
            useUnifiedTopology: true,
            //useCreateIndex: true
            }
        )
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        

        

    } catch (error) {
        console.error(`Error: ${error.message}`)
        process.exit(1) //exit the process with failure
    }
}

export default connectDB;