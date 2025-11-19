import express from "express";
import {
  allLogout,
  autoLogin,
  logout,
  profile,
  resendEmail,
  singIn,
  admin,
  singUp,
  verify_Email,
} from "../controllers/auth.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

router.post("/singup", singUp);
router.post("/singin", singIn);
router.get("/profile", authMiddleware, profile);
router.get("/verfiy-email/:token", verify_Email);
router.get("/auto", autoLogin);
router.post("/resend-email", resendEmail);
router.post("/logout", authMiddleware, logout);
router.post("/all-logout", authMiddleware, allLogout);
router.get("/admin", authMiddleware, isAdmin, admin);
export default router;
