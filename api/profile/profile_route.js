import Router from 'express';
import ProfileController from './profile_controller.js';
import multipleUpload from './multer_config.js';
import ProtectRoute from '../../core/authentication/auth.js'

const router = Router();

export default router;

router.post('/createProfile', multipleUpload, ProfileController.createProfile);
router.get('/getAllProfiles',ProfileController.getAllProfiles);
router.get('/getProfile',ProfileController.getProfileByProfileId);
router.put('/updateProfile',multipleUpload,ProfileController.updateProfile);
router.delete('/deleteProfile/:profileId',ProfileController.deleteProfile);
router.get('/download/:profileId', ProfileController.downloadAllFilesAsZip);
router.get('/download/:profileId/:fileProperty',ProfileController.getProfileByfileProperty);

