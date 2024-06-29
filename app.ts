require('dotenv').config()
import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import {ErrorMiddleware} from './middleware/error'
import userRouter from './routes/user.route'
import courseRouter from './routes/course.route'
import orderRouter from './routes/order.route'
import notificationRouter from './routes/notification.route'
import analyticsRouter from './routes/analytics.route'

export const app = express()

app.use(express.json({limit: '50mb'}))
app.use(cookieParser())
app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true
}))

app.use('/api/v1', userRouter, courseRouter, orderRouter, notificationRouter, analyticsRouter)

app.get('/test', (req: Request,res: Response, next:NextFunction)=>{
    res.status(200).json({
        success:true,
        message:"API is working"
    })
})

app.all('*', (req: Request, res: Response, next:NextFunction)=>{
    const err = new Error(`Route ${req.originalUrl} not found`) as any
    err.statusCode = 404
    next(err)
})

app.use(ErrorMiddleware)