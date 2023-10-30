

// Create course

import { Response } from "express";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import CourseModel from "../models/course.model";

export const createCourse = CatchAsyncErrors(async(data: any, res: Response) => {
    const course = await CourseModel.create(data);
    res.status(201).json({
        success: true,
        course,
    });
});

// Get All courses
export const getAllCourseService = async(res: Response) => {
    const courses = await CourseModel.find().sort({ createdAt: -1 });
  
    res.status(201).json({
      success: true,
      courses,
    });
  };