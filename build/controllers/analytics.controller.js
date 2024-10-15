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
exports.getOrdersAnalytics = exports.getCoursesAnalytics = exports.getUsersAnalytics = void 0;
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const catchAsyncError_1 = require("../middleware/catchAsyncError");
const analytics_generator_1 = require("../utils/analytics.generator");
const user_model_1 = __importDefault(require("../models/user.model"));
const course_model_1 = __importDefault(require("../models/course.model"));
const order_model_1 = __importDefault(require("../models/order.model"));
exports.getUsersAnalytics = (0, catchAsyncError_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, analytics_generator_1.generateLast12MonthsData)(user_model_1.default);
        res.status(200).json({
            success: true,
            users
        });
    }
    catch (error) {
        return new ErrorHandler_1.default(error.message, 500);
    }
}));
exports.getCoursesAnalytics = (0, catchAsyncError_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courses = yield (0, analytics_generator_1.generateLast12MonthsData)(course_model_1.default);
        res.status(200).json({
            success: true,
            courses
        });
    }
    catch (error) {
        return new ErrorHandler_1.default(error.message, 500);
    }
}));
exports.getOrdersAnalytics = (0, catchAsyncError_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield (0, analytics_generator_1.generateLast12MonthsData)(order_model_1.default);
        res.status(200).json({
            success: true,
            orders
        });
    }
    catch (error) {
        return new ErrorHandler_1.default(error.message, 500);
    }
}));
