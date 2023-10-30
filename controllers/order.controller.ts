import { NextFunction, Request, Response } from "express";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import ejs from "ejs";
import ErrorHandler from "../utils/ErrorHandler";
import { IOrder } from "../models/order.model";
import userModel from "../models/user.model";
import CourseModel, { ICourse } from "../models/course.model";
import { getAllOrdersService, newOrder } from "../services/order.service";
import path from "path";
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notification.model";
import { redis } from "../utils/redis";
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


export const CreateOrder = CatchAsyncErrors(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseId, payment_info } = req.body as IOrder;

        if(payment_info) {
            if("id" in payment_info) {
                const paymentIntentId = payment_info.id;
                const paymentIntent = await stripe.paymentIntents.retrieve(
                    paymentIntentId
                );

                if(paymentIntent.status !== "succeeded") {
                    return next(new ErrorHandler("Payment not authorized", 400));
                }
            }
        }

        const user = await userModel.findById(req.user?._id);

        const courseExistUnUser = user?.courses.some((course: any) => course._id.toString() === courseId);

        if(courseExistUnUser) {
            return next(new ErrorHandler("You have already purchased this  course", 400));
        };

        const course: ICourse | null = await CourseModel.findById(courseId);
        if(!course) {
            return next(new ErrorHandler("Not found", 400));
        };

        const data: any = {
            courseId: course._id,
            userId: user?._id,
            payment_info,
        };

        const mailData = {
            _id: course._id.toString().slice(0, 6),
            name: course.name,
            price: course.price,
            date: new Date().toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'}),
        };

        const html = await ejs.renderFile(path.join(__dirname, "../mails/order-confirmation.ejs"), {order:mailData});

        try {
            if(user) {
                await sendMail({
                    email: user.email,
                    subject: "Order Confirmation",
                    template: "order-confirmation.ejs",
                    data: mailData,
                })
            }
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        };

        user?.courses.push(course?._id);

        await redis.set(req.user?._id, JSON.stringify(user));

        await user?.save();

        await NotificationModel.create({
            user: user?._id,
            title: "New order",
            message: `You have a new order from ${course?.name}`,
        });

         // if(course.purchased) {
        //     course.purchased += 1;
        // }
       course.purchased = course.purchased +1; 

        await course.save();
        newOrder(data, res, next);

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
});

// Get all orders --- only for admin
export const getAllOrders = CatchAsyncErrors(async(req: Request, res: Response, next: NextFunction) => {
    try {
      getAllOrdersService(res);
     
    }catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
  });

  // send stripe published key
  export const sendStripePublishedKey = CatchAsyncErrors(async(req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        publishedAbleKey: process.env.STRIPE_PUBLISHED_KEY
    })
  });

   // New payment
   export const newPayment = CatchAsyncErrors(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const myPayment = await stripe.paymentIntents.create({
            amount: req.body.amount,
            currency: "USD",
            metadata: {
                company: "E-Learning",
            },
            automatic_payment_methods: {
               enabled: true, 
            }
        });
        res.status(201).json({
            success: true,
            client_secret: myPayment.client_secret,
        })
      }catch (error: any) {
          return next(new ErrorHandler(error.message, 400));
        }
  });