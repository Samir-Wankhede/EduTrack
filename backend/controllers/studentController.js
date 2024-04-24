import pg from "pg";
import {db} from "../server.js"
import axios from "axios";


const getDashboard = async(req,res) => {
    const reg_id = req.user.rows[0].reg_id
    try{
        const result = await db.query("SELECT t1.*, t2.*, t3.*, t4.* FROM student AS s JOIN student_attendance_sem1 AS t1 ON s.reg_id = t1.id JOIN student_attendance_sem2 AS t2 ON s.reg_id = t2.id JOIN student_result_sem1 AS t3 ON s.reg_id = t3.id JOIN student_result_sem2 AS t4 ON s.reg_id = t4.id WHERE s.reg_id = $1",[reg_id,]);
        if(result.rows.length>0){
            return res.status(200).json(result.rows[0])
        }else if (result.rows.length>1){
            return res.status(400).json({message:"Excess Record Present: ERROR"})
        }
        else{
            return res.status(400).json({message:"Record not pressent"})
        }
    }catch(err){
        return res.status(400).json(err)
    }
    
}

const getProfile = async (req,res) => {
    const email = req.user.rows[0].email
    try{
        const result = await db.query("SELECT * FROM student AS s WHERE s.email = $1",[email,]);
        if(result.rows.length>0){
            return res.status(200).json(result.rows[0])
        }else if (result.rows.length>1){
            return res.status(400).json({message:"Excess Record Present: ERROR"})
        }
        else{
            return res.status(400).json({message:"Record not pressent"})
        }
    }catch(err){
        return res.status(400).json(err)
    }
}

const postProfile = async (req,res) => {
    const useremail = req.user.rows[0].email
    const {name, email, reg_id, division} = req.body
    try{
        const result = await db.query("UPDATE student SET name = $1, email = $2, division = $3, reg_id = $4 WHERE student.email = $5",[name,email,division,reg_id,useremail,]);
        if(result.rows.length>0){
            return res.status(200).json(result.rows[0])
        }else if (result.rows.length>1){
            return res.status(400).json({message:"Excess Record Present: ERROR"})
        }
        else{
            return res.status(400).json({message:"Record not pressent"})
        }
    }catch(err){
        return res.status(400).json(err)
    }
}

const getNotice = async (req,res) => {
    const reg_id = req.user.rows[0].reg_id
    try{
        const result = await db.query("SELECT t1.* FROM student AS s JOIN notices AS t1 ON s.reg_id = t1.id WHERE s.reg_id = $1",[reg_id,]);
        if(result.rows.length>0){
            return res.status(200).json(result.rows[0])
        }else if (result.rows.length>1){
            return res.status(400).json({message:"Excess Record Present: ERROR"})
        }
        else{
            return res.status(400).json({message:"Record not pressent"})
        }
    }catch(err){
        return res.status(400).json(err)
    }
}

const getAttendance = async (req,res) => {
    const {id} = req.params
    const reg_id = req.user.rows[0].reg_id
    try{
        if (id == "sem1"){
            const result = await db.query("SELECT t1.* FROM student AS s JOIN student_attendance_sem1 AS t1 ON s.reg_id = t1.id WHERE s.reg_id = $1",[reg_id])
            if(result.rows.length>0){
                return res.status(200).json(result.rows[0])
            }else if (result.rows.length>1){
                return res.status(400).json({message:"Excess Record Present: ERROR"})
            }
            else{
                return res.status(400).json({message:"Record not pressent"})
            }
        }else if(id == "sem2"){
            const result = await db.query("SELECT t1.* FROM student AS s JOIN student_attendance_sem2 AS t1 ON s.reg_id = t1.id WHERE s.reg_id = $1",[reg_id])
            if(result.rows.length>0){
                return res.status(200).json(result.rows[0])
            }else if (result.rows.length>1){
                return res.status(400).json({message:"Excess Record Present: ERROR"})
            }
            else{
                return res.status(400).json({message:"Record not pressent"})
            }
        }
    }catch(err){
        return res.status(400).json(err)
    }
}

const getResult = async (req,res) => {
    const {id} = req.params
    const reg_id = req.user.rows[0].reg_id
    try{
        if (id == "sem1"){
            const result = await db.query("SELECT t1.* FROM student AS s JOIN student_result_sem1 AS t1 ON s.reg_id = t1.id WHERE s.reg_id = $1",[reg_id])
            if(result.rows.length>0){
                return res.status(200).json(result.rows[0])
            }else if (result.rows.length>1){
                return res.status(400).json({message:"Excess Record Present: ERROR"})
            }
            else{
                return res.status(400).json({message:"Record not pressent"})
            }
        }else if(id == "sem2"){
            const result = await db.query("SELECT t1.* FROM student AS s JOIN student_result_sem2 AS t1 ON s.reg_id = t1.id WHERE s.reg_id = $1",[reg_id])
            if(result.rows.length>0){
                return res.status(200).json(result.rows[0])
            }else if (result.rows.length>1){
                return res.status(400).json({message:"Excess Record Present: ERROR"})
            }
            else{
                return res.status(400).json({message:"Record not pressent"})
            }
        }
    }catch(err){
        return res.status(400).json(err)
    }
}

const getSem1Result = async (req,res) => {
    const {id} = req.params
    const reg_id = req.user.rows[0].reg_id
    try{
        const result = await db.query(`SELECT t1.${id}_ut1,t1.${id}_ut2,t1.${id}_pr1,t1.${id}_pr2 FROM student AS s JOIN student_result_sem1 AS t1 ON s.reg_id = t1.id WHERE s.reg_id = $1`,[reg_id])
        if(result.rows.length>0){
            return res.status(200).json(result.rows[0])
        }else if (result.rows.length>1){
            return res.status(400).json({message:"Excess Record Present: ERROR"})
        }
        else{
            return res.status(400).json({message:"Record not pressent"})
        }
    }catch(err){
        return res.status(400).json(err)
    }
}

const getSem1Attendance = async (req,res) => {
    const {id} = req.params
    const reg_id = req.user.rows[0].reg_id
    var data = {};
    try{
        const result = await db.query(`SELECT t1.${id}_present,t1.${id}_notupdated,t1.${id}_absent,t1.${id}_total, t1.${id}_per FROM student AS s JOIN student_attendance_sem1 AS t1 ON s.reg_id = t1.id WHERE s.reg_id = $1`,[reg_id])
        await axios({
            method:"POST",
            url:"http://127.0.0.1:5000/predict",
            data:{
                student_id :`${reg_id}`,
                sub :`${id}`,
                sem : "1" 
            }
        })
        .then(res => {
            data = res.data;
          })
          .catch(err => {
            console.log("error in request", err);
          });
        if(result.rows.length>0){
            return res.status(200).json([result.rows[0],data])
        }else if (result.rows.length>1){
            return res.status(400).json({message:"Excess Record Present: ERROR"})
        }
        else{
            return res.status(400).json({message:"Record not pressent"})
        }
    }catch(err){
        return res.status(400).json(err)
    }
}

const getSem2Result = async (req,res) => {
    const {id} = req.params
    const reg_id = req.user.rows[0].reg_id
    try{
        const result = await db.query(`SELECT t1.${id}_ut1,t1.${id}_ut2,t1.${id}_pr1,t1.${id}_pr2 FROM student AS s JOIN student_result_sem2 AS t1 ON s.reg_id = t1.id WHERE s.reg_id = $1`,[reg_id])
        if(result.rows.length>0){
            return res.status(200).json(result.rows[0])
        }else if (result.rows.length>1){
            return res.status(400).json({message:"Excess Record Present: ERROR"})
        }
        else{
            return res.status(400).json({message:"Record not pressent"})
        }
    }catch(err){
        return res.status(400).json(err)
    }
}

const getSem2Attendance = async (req,res) => {
    const {id} = req.params
    const reg_id = req.user.rows[0].reg_id
    var data = {};
    try{
        const result = await db.query(`SELECT t1.${id}_present,t1.${id}_notupdated,t1.${id}_absent,t1.${id}_total, t1.${id}_per FROM student AS s JOIN student_attendance_sem2 AS t1 ON s.reg_id = t1.id WHERE s.reg_id = $1`,[reg_id])
        await axios({
            method:"POST",
            url:"http://127.0.0.1:5000/predict",
            data:{
                student_id :`${reg_id}`,
                sub :`${id}`,
                sem : "2" 
            }
        })
        .then(res => {
            data = res.data;
          })
          .catch(err => {
            console.log("error in request", err);
          });
        if(result.rows.length>0){
            return res.status(200).json([result.rows[0],data])
        }else if (result.rows.length>1){
            return res.status(400).json({message:"Excess Record Present: ERROR"})
        }
        else{
            return res.status(400).json({message:"Record not pressent"})
        }
    }catch(err){
        return res.status(400).json(err)
    }
}

const postFeedback = async (req,res) => {
    const reg_id = req.user.rows[0].reg_id
    const {rating, fmessage} = req.body
    try{
        const result = await db.query("INSERT INTO feedbacks (id,rating,feedback) VALUES ($1,$2,$3) ",[reg_id,rating,fmessage,])
        return res.status(200).json(result.rows[0])
    }catch(err){
        return res.status(400).json(err)
    }
}

export 
{getDashboard,
getProfile,
postProfile,
getNotice,
getAttendance,
getSem1Attendance,
getSem1Result,
getSem2Attendance,
getSem2Result,
getResult,
postFeedback
};