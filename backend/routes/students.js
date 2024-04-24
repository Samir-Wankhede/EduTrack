import express from "express"
import requireAuth from "../middleware/requireAuth.js";
import { 
    getDashboard,
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
} from "../controllers/studentController.js";

const router = express.Router();

router.use(requireAuth)

router.get("/Dashboard",getDashboard)

router.get("/Profile",getProfile)

router.post("/Profile",postProfile)

router.get("/Notice",getNotice)

router.get("/Attendance/:id",getAttendance)

router.get("/Attendance/sem1/:id",getSem1Attendance)

router.get("/Attendance/sem2/:id",getSem2Attendance)

router.get("/Result/:id",getResult)

router.get("/Result/sem1/:id",getSem1Result)

router.get("/Result/sem2/:id",getSem2Result)

router.post("/Feedback",postFeedback)

export default router;