import Router from 'express';
import ModuleController from './module_controller.js';
import ProtectRoute from '../../core/authentication/auth.js';
const router = Router();

export default router;

router.post('/addModule',ModuleController.createModule);
router.get('/getModuleById/:moduleId',ModuleController.getModuleById);
router.get('/getModules',ModuleController.getModules);
router.put('/updateModule',ModuleController.updateModule);
router.delete('/deleteModuleById/:moduleId',ModuleController.deleteModule);