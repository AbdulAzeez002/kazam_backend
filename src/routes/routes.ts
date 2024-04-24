import express from "express";
import { getAllTodos } from "../controller/controller";

const router = express.Router();

// route for fetching all the tasks
router.get("/fetchAllTasks", getAllTodos);

export default router;
