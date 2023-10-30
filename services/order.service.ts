import { NextFunction, Response } from "express";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import OrderModel from "../models/order.model";

// Create new order
export
 const newOrder = CatchAsyncErrors(async(data: any, res: Response, next: NextFunction) => {
    const order = await OrderModel.create(data);
    res.status(201).json({
      success: true,
      order,
  })
 });

 // Get All orders
export const getAllOrdersService = async(res: Response) => {
   const orders = await OrderModel.find().sort({ createdAt: -1 });
 
   res.status(201).json({
     success: true,
     orders,
   });
 };