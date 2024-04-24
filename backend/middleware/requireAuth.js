import jwt from "jsonwebtoken";
import { db } from "../server.js";

const requireAuth = async (req,res,next) => {
    //verify auth
    const {authorization} = req.headers
    if (!authorization){
        return res.status(401).json({error:"Authorization Token required"})
    }

    const token = authorization.split(" ")[1]

    try{
       const {email} = jwt.verify(token, process.env.SECRET)
       req.user = await db.query("SELECT * FROM student WHERE email=$1",[email,])
       next()
    }catch(error){
        console.log(error)
        res.status(401).json({error:"request not authorised"})
    }

}

export default requireAuth;