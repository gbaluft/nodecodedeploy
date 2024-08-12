import Router from 'express';
import UserController from './user_controller.js';
import ProtectRoute from '../../core/authentication/auth.js';
const router = Router();

export default router;

router.post('/registerSuperAdmin',UserController.registerSuperAdmin)
router.post ('/signupUser', ProtectRoute.protect,
    ProtectRoute.authorizeRoles('superadmin'),UserController.signupUser);