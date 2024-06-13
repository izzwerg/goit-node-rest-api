import express from "express";

import AuthController from "../controllers/usersControllers.js";

import authMiddleware from "../middlewares/auth.js";
import uploadMiddleware from "../middlewares/upload.js";

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/logout", authMiddleware, AuthController.logout);
router.get("/current", authMiddleware, AuthController.current);
router.patch("/", authMiddleware, AuthController.updateSubscription);
router.get("/avatars", authMiddleware, AuthController.getAvatar);
router.patch(
  "/avatars",
  authMiddleware,
  uploadMiddleware.single("avatar"),
  (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({
        message: "The file was not transferred.",
      });
    }
    next();
  },
  AuthController.updateAvatar
);

export default router;
