import express from "express";
import ReportController from "../controllers/reportController.js";

const router = express.Router();

router.get("/", ReportController.getReport);

export default router;