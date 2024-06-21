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

export const sendToken = ( user: IUser, statusCode: number, res: Response) => {
    const accessToken = user.SignAccessToken()
    const refreshToken = user.SignRefreshToken()

    
}