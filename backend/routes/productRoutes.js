import express from "express";
import ProductController from "../controllers/productController.js";

import verifyToken from "../middleware/verifyToken.js";
import authorize from "../middleware/authorize.js";

const router = express.Router();

router.get(
    "/",
    verifyToken,
    ProductController.getAll
);

router.get(
    "/:id",
    verifyToken,
    ProductController.getById
);

router.post(
    "/",
    verifyToken,
    authorize("admin"),
    ProductController.create
);

router.put(
    "/:id",
    verifyToken,
    authorize("admin"),
    ProductController.update
);

router.delete(
    "/:id",
    verifyToken,
    authorize("admin"),
    ProductController.delete
);

export default router;