import Router from 'express';
import TrialController from './trial_controller.js';
import ProtectRoute from '../../core/authentication/auth.js'
const router = Router();

export default router;

router.post ('/add',TrialController.createTrial);
router.get('/trialDetails/:trailId',TrialController.getTrialDetails);
router.get('/trails/:exerciseId', TrialController.getTrialsByExerciseId);
router.delete('/delete/:trialId', TrialController.deleteTrial);
router.put('/update', TrialController.updateTrial);
router.get('/download/:trialId',TrialController.downloadTrialDetails);