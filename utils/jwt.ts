require('dotenv').config()
import { Request, Response } from 'express'
import { IUser } from '../models/user.model'
import { redis } from './redis'
import { isTypeQueryNode } from 'typescript'

interface ITokenOptions {
    expires: Date,
    maxAge: number,
    httpOnly: boolean,
    sameSite: 'lax' | 'strict' | 'none' | undefined,
    secure?: boolean,
}

const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || '300', 10)
const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || '1200', 10)

export const accessTokenOptions: ITokenOptions = {
    expires: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000),
    maxAge: accessTokenExpire * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
}

export const refreshTokenOptions: ITokenOptions = {
    expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
    maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
}

export const sendToken = (user: IUser, statusCode: number, res: Response) => {
    const accessToken = user.SignAccessToken()
    const refreshToken = user.SignRefreshToken()

    redis.set(user.id, JSON.stringify(user) as any)

    res.cookie('access_token', accessToken, accessTokenOptions)
    res.cookie('refresh_token', refreshToken, refreshTokenOptions)

    res.status(statusCode).json({
        success: true,
        user,
        accessToken,
        refreshToken
    })
}