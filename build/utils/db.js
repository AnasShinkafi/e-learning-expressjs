"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// const mongoose = require('mongoose')
require("dotenv").config();
const dbUrl = process.env.DB_URL || "";
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(dbUrl).then((data) => {
            console.log(`database connected with ${data.connection.host}`);
        });
    }
    catch (error) {
        console.log(error.message);
        setTimeout(connectDB, 5000);
    }
    mongoose_1.default.connection.on("connected", () => {
        console.log('mongoose connected');
    });
};
exports.default = connectDB;