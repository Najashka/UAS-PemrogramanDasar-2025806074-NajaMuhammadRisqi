import express from "express";
import ProductController from "../controllers/productController.js";

const router = express.Router();

router.get("/", ProductController.getAll);

router.post("/", ProductController.create);

export default router;