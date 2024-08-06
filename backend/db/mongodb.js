import mongoose from "mongoose";

const connectMongoDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_STRING); 
        console.log(`MongoDB Connected`);
    }
    catch(err){
        console.error(`Error connecting to MongoDB: ${err.message}`)
        process.exit(1);
    }
}


export default connectMongoDB;