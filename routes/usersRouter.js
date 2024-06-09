import express from "express";

import AuthController from "../controllers/usersControllers.js";

import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/logout", authMiddleware, AuthController.logout);
router.get("/current", authMiddleware, AuthController.current);
router.patch("/", authMiddleware, AuthController.updateSubscription);

export default router;
