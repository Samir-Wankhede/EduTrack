import express from "express";
import {
    createUser,
    checkUser
}
from "../controllers/userControllers.js"

const router = express.Router();

router.post("/signup",createUser);
router.post("/signin",checkUser);

export default router;