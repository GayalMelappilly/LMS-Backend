import { Response } from "express"
import { redis } from "../utils/redis"
import userModel from "../models/user.model"

export const getUserById = async (id: string, res: Response) => {
    const userJSON = await redis.get(id)

    if (userJSON) {
        const user = JSON.parse(userJSON)
        res.status(201).json({
            success: true,
            user
        })
    }
}

export const getAllUsersService = async (res: Response) => {
    const users = await userModel.find().sort({ createdAt: -1 })

    res.status(201).json({
        success: true,
        users
    })
}