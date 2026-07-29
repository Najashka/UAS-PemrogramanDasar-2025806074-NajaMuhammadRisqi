import express from "express";
import UserController from "../controllers/userController.js";

const router = express.Router();

// ===============================
// GET
// ===============================
router.get("/", UserController.getAll);

router.get("/:id", UserController.getById);

// ===============================
// POST
// ===============================
router.post("/", UserController.create);

// ===============================
// PUT
// ===============================
router.put("/:id", UserController.update);

// ===============================
// RESET PASSWORD
// ===============================
router.patch(
    "/:id/reset-password",
    UserController.resetPassword
);

// ===============================
// DELETE
// ===============================
router.delete("/:id", UserController.delete);

export default router;