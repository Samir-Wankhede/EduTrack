import express from "express";
import bodyParser from "body-parser";
import user from "./routes/user.js";
import student from "./routes/students.js";
import pg from "pg";
import env from "dotenv";
import cors from "cors";

env.config();
const app = express();


//middlewares
app.use(cors());
app.use(express.json());
 app.use(express.static("public"));
app.use((req,res,next)=>{
    console.log(req.path, req.method);
    next();
});

//routes
app.use("/",user);
app.use("/",student);

//dbConnection
const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});
  db.connect()
  .then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`Connected to DB and listening on port ${process.env.PORT}`);
        })
    })
    .catch((err)=>{
        console.log(err);
    });

    export {db};