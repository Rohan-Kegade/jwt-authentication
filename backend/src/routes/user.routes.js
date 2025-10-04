import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Auth routes
router.get("/me", verifyJWT, (req, res) => {
  // req.user is attached by verifyJWT middleware
  return res.status(200).json({
    success: true,
    user: req.user, // contains id, username, email
  });
});

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", verifyJWT, logoutUser);
router.post("/refresh", refreshAccessToken);

export default router;
