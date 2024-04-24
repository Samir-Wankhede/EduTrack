import pg from "pg";
import bcrypt from "bcrypt";
import { db } from "../server.js";
import jwt from "jsonwebtoken";

const saltrounds = 10;
const createToken = (email) => {
  return jwt.sign({email},process.env.SECRET,{expiresIn: '3d'})
}

//postlogin
const checkUser = async (req,res)=>{
    const {email, password} = req.body;
    try {
        const result = await db.query("SELECT sp.* FROM student_password sp JOIN student s ON sp.id = s.reg_id WHERE s.email = $1", [
          email,
        ]);
        const namerow = await db.query("SELECT * FROM student WHERE student.email = $1",[email,])
        const name = namerow.rows[0].name
        const division = namerow.rows[0].division
        if (result.rows.length > 0) {
          const user = result.rows[0];
          const storedHashedPassword = user.password;
          bcrypt.compare(password, storedHashedPassword,(err,yes_or_no)=>{
            if (err){
              console.log("ERROR IN COMPARE");
            }else{
              const token = createToken(email)
              if (yes_or_no) {
                res.status(200).json({name,division,email,token});
                //console.log("ok");
              } else {
                res.status(400).json({message:"incorrect password"});
              }
            }
          });
        } else {
            res.status(400).json({message:"user does not exist"});
        }
      } catch (err) {
        res.status(400).json({message: err})
      }
};

//postregister
const createUser = async (req,res)=>{
    const {name, email, reg_id, password, confirmed_password,division} = req.body;
    console.log(name, email, reg_id, password, confirmed_password,division)
    if (password!== confirmed_password){
        return res.status(400).json({message:"Password and Confirmation doesn't match"})
    }
        try{
            const if_present = await db.query("SELECT * FROM student WHERE email = $1",[email]);
            if (if_present.rows.length>0){
                return res.status(400).json({message: "User already present"})
            }else{
                bcrypt.hash(password,saltrounds,async (err,hash)=>{
                    if(err){
                        console.log(err);
                    }else{
                        //console.log("ok");
                        await db.query("INSERT INTO student (name,email,reg_id,division) VALUES ($1,$2,$3,$4)",[name,email,reg_id,division]);
                        //console.log("ok2");
                        await db.query("INSERT INTO student_password(id,password) VALUES ($1,$2)",[reg_id,hash]);
                        const token = createToken(email)
                        return res.status(200).json({name,division,email,token})
                    }
                });
            }
        }catch(err){
          res.status(400).json({message: err})
        }
        //console.log({name, email, reg_id, password, confirmation_password, gender});
};

export {
    checkUser,
    createUser,
}