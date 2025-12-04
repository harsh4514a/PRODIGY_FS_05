// import mongoose from "mongoose";

// const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URI);
//         console.log('mongodb connected successfully.');
//     } catch (error) {
//         console.log(error);
//     }
// }
// export default connectDB;

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();


const connectDB = async () => {
    try {
        console.log("MONGO_URI from env =>", process.env.MONGO_URI); // 👈 add this

        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log("mongodb connected successfully.");
    } catch (error) {
        console.log("MongoDB connection error:", error);
    }
};

export default connectDB;
