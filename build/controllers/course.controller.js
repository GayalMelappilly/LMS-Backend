"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVideoUrl = exports.deleteCourse = exports.getAdminAllCourses = exports.addReplyToReview = exports.addReview = exports.addAnswer = exports.addQuestion = exports.getCourseByUser = exports.getAllCourses = exports.getSingleCourse = exports.editCourse = exports.uploadCourse = void 0;
const catchAsyncError_1 = require("../middleware/catchAsyncError");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const course_service_1 = require("../services/course.service");
const course_model_1 = __importDefault(require("../models/course.model"));
const redis_1 = require("../utils/redis");
const mongoose_1 = __importDefault(require("mongoose"));
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const sendMail_1 = __importDefault(require("../utils/sendMail"));
const notification_model_1 = __importDefault(require("../models/notification.model"));
const axios_1 = __importDefault(require("axios"));
exports.uploadCourse = (0, catchAsyncError_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail;
        if (thumbnail) {
            const myCloud = yield cloudinary_1.default.v2.uploader.upload(thumbnail, {
                folder: 'courses'
            });
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            };
        }
        (0, course_service_1.createCourse)(data, res, next);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
exports.editCourse = (0, catchAsyncError_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail;
        const courseId = req.params.id;
        const courseData = yield course_model_1.default.findById(courseId);
        if (thumbnail && !thumbnail.startsWith("https")) {
            yield cloudinary_1.default.v2.uploader.destroy(courseData.thumbnail.public_id);
            const myCloud = yield cloudinary_1.default.v2.uploader.upload(thumbnail, {
                folder: "courses",
            });
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }
        if (thumbnail.startsWith("https")) {
            data.thumbnail = {
                public_id: courseData === null || courseData === void 0 ? void 0 : courseData.thumbnail.public_id,
                url: courseData === null || courseData === void 0 ? void 0 : courseData.thumbnail.url,
            };
        }
        const course = yield course_model_1.default.findByIdAndUpdate(courseId, {
            $set: data,
        }, { new: true });
        yield redis_1.redis.set(courseId, JSON.stringify(course)); // update course in redis
        res.status(201).json({
            success: true,
            course,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
exports.getSingleCourse = (0, catchAsyncError_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courseId = req.params.id;
        const isCacheExist = yield redis_1.redis.get(courseId);
        if (isCacheExist) {
            const course = JSON.parse(isCacheExist);
            res.status(200).json({
                success: true,
                course
            });
        }
        else {
            const course = yield course_model_1.default.findById(req.params.id).select('-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links');
            yield redis_1.redis.set(courseId, JSON.stringify(course), "EX", 604800); // 7 days
            res.status(200).json({
                success: true,
                course
            });
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
exports.getAllCourses = (0, catchAsyncError_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courses = yield course_model_1.default.find().select('-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links');
        res.status(200).json({
            success: true,
            courses
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
exports.getCourseByUser = (0, catchAsyncError_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userCourseList = (_a = req.user) === null || _a === void 0 ? void 0 : _a.course;
        const courseId = req.params.id;
        const courseExist = userCourseList === null || userCourseList === void 0 ? void 0 : userCourseList.find((course) => course._id.toString() === courseId);
        if (!courseExist) {
            return next(new ErrorHandler_1.default('You have not purchased this course', 400));
        }
        const course = yield course_model_1.default.findById(courseId);
        const content = course === null || course === void 0 ? void 0 : course.courseData;
        res.status(200).json({
            success: true,
            content
        });
        res.json({ reached: (_b = req.user) === null || _b === void 0 ? void 0 : _b.course });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
exports.addQuestion = (0, catchAsyncError_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    try {
        const { question, courseId, contentId } = req.body;
        const course = yield course_model_1.default.findById(courseId);
        if (!mongoose_1.default.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler_1.default('Invalid content id', 400));
        }
        const courseContent = (_c = course === null || course === void 0 ? void 0 : course.courseData) === null || _c === void 0 ? void 0 : _c.find((item) => item._id.equals(contentId)); //equals same as item._id === contentId
        if (!courseContent) {
            return next(new ErrorHandler_1.default('Content not found', 400));
        }
        const newQuestion = {
            user: req.user,
            question,
            quesionReplies: []
        };
        courseContent.questions.push(newQuestion);
        yield notification_model_1.default.create({
            user: (_d = req.user) === null || _d === void 0 ? void 0 : _d._id,
            title: "New Question Received",
            message: `You have a new question in ${courseContent === null || courseContent === void 0 ? void 0 : courseContent.title}`
        });
        yield (course === null || course === void 0 ? void 0 : course.save());
        res.status(200).json({
            success: true,
            course
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
exports.addAnswer = (0, catchAsyncError_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f, _g, _h;
    try {
        const { answer, courseId, contentId, questionId } = req.body;
        const course = yield course_model_1.default.findById(courseId);
        if (!mongoose_1.default.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler_1.default('Invalid content id', 400));
        }
        const courseContent = (_e = course === null || course === void 0 ? void 0 : course.courseData) === null || _e === void 0 ? void 0 : _e.find((item) => item._id.equals(contentId)); //equals same as item._id === contentId
        if (!courseContent) {
            return next(new ErrorHandler_1.default('Content not found', 400));
        }
        const question = (_f = courseContent === null || courseContent === void 0 ? void 0 : courseContent.questions) === null || _f === void 0 ? void 0 : _f.find((item) => item._id.equals(questionId));
        if (!question) {
            return next(new ErrorHandler_1.default('Question not found', 400));
        }
        const newAnswer = {
            user: req.user,
            answer,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        question.questionReplies.push(newAnswer);
        yield (course === null || course === void 0 ? void 0 : course.save());
        if (((_g = req.user) === null || _g === void 0 ? void 0 : _g._id) === question.user._id) {
            yield notification_model_1.default.create({
                user: (_h = req.user) === null || _h === void 0 ? void 0 : _h._id,
                title: "New Question Reply Received",
                message: `You have a new answer in your question in ${courseContent === null || courseContent === void 0 ? void 0 : courseContent.title}`
            });
        }
        else {
            const data = {
                name: question.user.name,
                title: courseContent.title,
            };
            const html = yield ejs_1.default.renderFile(path_1.default.join(__dirname, "../mails/question-reply-mail.ejs"), data);
            try {
                yield (0, sendMail_1.default)({
                    email: question.user.email,
                    subject: 'Question reply',
                    template: 'question-reply-mail.ejs',
                    data
                });
            }
            catch (error) {
                return next(new ErrorHandler_1.default(error.message, 500));
            }
        }
        res.status(200).json({
            success: true,
            course
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
exports.addReview = (0, catchAsyncError_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _j, _k, _l;
    try {
        const userCourseList = (_j = req.user) === null || _j === void 0 ? void 0 : _j.course;
        const courseId = req.params.id;
        const courseExist = userCourseList === null || userCourseList === void 0 ? void 0 : userCourseList.some((course) => course._id.toString() === courseId.toString());
        if (!courseExist) {
            return next(new ErrorHandler_1.default('You have not purchased this course', 400));
        }
        const course = yield course_model_1.default.findById(courseId);
        const { review, rating } = req.body;
        const reviewData = {
            user: req.user,
            comment: review,
            rating
        };
        course === null || course === void 0 ? void 0 : course.reviews.push(reviewData);
        let avg = 0;
        course === null || course === void 0 ? void 0 : course.reviews.forEach((rev) => {
            avg += rev.rating;
        });
        if (course) {
            course.ratings = avg / course.reviews.length; // calculating avg rating.
        }
        yield (course === null || course === void 0 ? void 0 : course.save());
        yield redis_1.redis.set(courseId, JSON.stringify(course), "EX", 604800);
        yield notification_model_1.default.create({
            user: (_k = req.user) === null || _k === void 0 ? void 0 : _k._id,
            title: "New Review Receiver",
            message: `${(_l = req.user) === null || _l === void 0 ? void 0 : _l.name} has given a review in ${course === null || course === void 0 ? void 0 : course.name}`
        });
        res.status(200).json({
            success: true,
            course
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
exports.addReplyToReview = (0, catchAsyncError_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _m, _o;
    try {
        const { comment, courseId, reviewId } = req.body;
        const course = yield course_model_1.default.findById(courseId);
        if (!course) {
            return next(new ErrorHandler_1.default('Course not found', 400));
        }
        const review = (_m = course === null || course === void 0 ? void 0 : course.reviews) === null || _m === void 0 ? void 0 : _m.find((rev) => rev._id.toString() === reviewId);
        if (!review) {
            return next(new ErrorHandler_1.default('Review not found', 400));
        }
        const replyData = {
            user: req.user,
            comment,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        if (!review.commentReplies) {
            review.commentReplies = [];
        }
        (_o = review.commentReplies) === null || _o === void 0 ? void 0 : _o.push(replyData);
        yield (course === null || course === void 0 ? void 0 : course.save());
        yield redis_1.redis.set(courseId, JSON.stringify(course), "EX", 604800);
        res.status(200).json({
            success: true,
            course
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
exports.getAdminAllCourses = (0, catchAsyncError_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, course_service_1.getAllCoursesService)(res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
}));
exports.deleteCourse = (0, catchAsyncError_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const course = yield course_model_1.default.findById(id);
        if (!course) {
            return next(new ErrorHandler_1.default("Course not found", 400));
        }
        yield course.deleteOne({ id });
        yield redis_1.redis.del(id);
        res.status(200).json({
            success: true,
            message: "Course deleted successfully"
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
}));
exports.generateVideoUrl = (0, catchAsyncError_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { videoId } = req.body;
        const response = yield axios_1.default.post(`https://dev.vdocipher.com/api/videos/${videoId}/otp`, { ttl: 300 }, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
            },
        });
        res.json(response.data);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
}));
