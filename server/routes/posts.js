import express from 'express'
import {getUserData,createUser, deleteUser, updateUserDetails} from '../controllers/posts.js'
const router = express.Router()

router.post("/",createUser)

router.get("/",getUserData)

router.delete("/:id", deleteUser)

router.put("/:id", updateUserDetails)

export default router 