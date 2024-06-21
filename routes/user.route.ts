import express from 'express'
import { activateUser, loginUser, registerUser } from '../controllers/user.controller'

const userRouter = express.Router()

userRouter.post('/registration', registerUser)
userRouter.post('/activate-user', activateUser)
userRouter.post('/login', loginUser)

export default userRouter