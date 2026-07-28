import express from "express";
import DashboardController from "../controllers/dashboardController.js";

const router = express.Router();

// ===============================
// GET DASHBOARD
// ===============================
router.get("/", DashboardController.getDashboard);

export default router;