import { Router } from "express";
const router = Router();
import LoginController from "./login_controller.js";

export default router;

router.post('/login',LoginController.login);
router.post('/refreshToken',LoginController.accessToken);
