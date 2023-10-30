import mongoose from 'mongoose'
// const mongoose = require('mongoose')
require("dotenv").config();

const dbUrl: string = process.env.DB_URL || "";

const connectDB = async () => {
    try {
        await mongoose.connect(dbUrl).then((data: any) => {
            console.log(`database connected with ${data.connection.host}`);
            
        })
    } catch (error: any) {
        console.log(error.message);
        setTimeout(connectDB, 5000);
        
    }  
    mongoose.connection.on("connected", () => {
        console.log('mongoose connected');
        
    })
}



export default connectDB;
