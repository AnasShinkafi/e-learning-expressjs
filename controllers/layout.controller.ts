import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import LayoutModel from "../models/layout.model";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import cloudinary from 'cloudinary';

export const createLayout = CatchAsyncErrors(async(req: Request, res: Response, nex: NextFunction) => {
    try {
        const { type } = req.body;
        const isTypeExist = await LayoutModel.findOne({ type });
        if(isTypeExist) {
            return nex(new ErrorHandler(`${type} already exist`, 400))
        }
        if(type === "Banner") {
            const {image, title, subTitle} = req.body;

            const myCloud = await cloudinary.v2.uploader.upload(image, {
                folder: "layout",
            });
            const banner = {
                type: "Banner",
                banner: {
                    image: {
                        public_id: myCloud.public_id,
                        url: myCloud.secure_url,
                    },
                },
                title,
                subTitle,
            }
            await LayoutModel.create(banner);
        }
        if(type === "FAQ") {
            const {faq} = req.body;
            const faqItems = await Promise.all(
                faq.map(async(item: any) => {
                    return {
                        question: item.question,
                        answer: item.answer,
                    };
                })
            );
            await LayoutModel.create({type: "FAQ", faq: faqItems});
        };
        if(type === "Categories") {
            const {categories} = req.body;
            const categoriesItems = await Promise.all(
                categories.map(async(item: any) => {
                    return {
                        title: item.title,
                    };
                })
            );
            await LayoutModel.create({type: "Categories", categories: categoriesItems});
        }

        res.status(200).json({
            success: true,
            message: "Layout created successfully", 
        })
    } catch (error: any) {
        return nex(new ErrorHandler(error.message, 500))
    }
});

// Edit layout
export const editLayout = CatchAsyncErrors(async(req: Request, res: Response, nex: NextFunction) => {
    try {
        const { type } = req.body;
        if(type === "Banner") {
            const bannerData: any = await LayoutModel.findOne({ type: "Banner" });
            const {image, title, subTitle} = req.body;

            const data = image.startWith("https")
                ? bannerData
                : await cloudinary.v2.uploader.upload(image, {
                    folder: "layout",
                });

            const banner = {
                type: "banner",
                image: {
                    public_id: image.startWith("https")
                        ? bannerData.banner.image.public_id
                        : data?.public_id,
                    url: image.startWith("https")
                        ? bannerData.banner.image.url
                        : data?.secure_url,
                },
                title,
                subTitle,
            }
            await LayoutModel.findByIdAndUpdate(bannerData._id,{banner});
        }
        if(type === "FAQ") {
            const {faq} = req.body;
            const faqItem = await LayoutModel.findOne({ type: "FAQ"})
            const faqItems = await Promise.all(
                faq.map(async(item: any) => {
                    return {
                        question: item.question,
                        answer: item.answer,
                    };
                })
            );
            await LayoutModel.findByIdAndUpdate(faqItem?._id,{type: "FAQ", faq: faqItems});
        };
        if(type === "Categories") { 
            const {categories} = req.body;
            const categoriesData = await LayoutModel.findOne({ type: "Categories"})
            const categoriesItems = await Promise.all(
                categories.map(async(item: any) => {
                    return {
                        title: item.title,
                    };
                })
            );
            await LayoutModel.findByIdAndUpdate(categoriesData?._id,{type: "Category", categories: categoriesItems});
        }

        res.status(200).json({ 
            success: true,
            message: "Layout updated successfully", 
        })
    } catch (error: any) {
        return nex(new ErrorHandler(error.message, 500))
    }
});

// Get layout by type
export const getLayoutByType = CatchAsyncErrors(async(req: Request, res: Response, nex: NextFunction) => {
    try {
        const {type} = req.params;
        const layout = await LayoutModel.findOne({type});
        res.status(200).json({ 
            success: true,
            layout, 
        })
    } catch (error: any) {
        return nex(new ErrorHandler(error.message, 500))
    }
});