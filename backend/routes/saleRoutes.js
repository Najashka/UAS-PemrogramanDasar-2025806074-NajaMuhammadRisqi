import express from "express";
import SaleController from "../controllers/saleController.js";

const router = express.Router();

// ===============================
// GET
// ===============================
router.get("/", SaleController.getAll);
router.get("/:id", SaleController.getById);

// ===============================
// POST
// ===============================
router.post("/", SaleController.create);

// ===============================
// PUT
// ===============================
router.put("/:id", SaleController.update);

// ===============================
// DELETE
// ===============================
router.delete("/:id", SaleController.delete);

export default router;