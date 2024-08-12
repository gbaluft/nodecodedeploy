import Router from 'express';
import TrailReadingController from  './trialReading_controller.js';
import ProtectRoute from '../../core/authentication/auth.js'
const router = Router();

export default router;

router.post('/addTrailReading',TrailReadingController.createTrailReading);
router.get('/getTrailReadingByTrailReadingId/:trailReadingId',TrailReadingController.getTrailReadingsByTrailReadingId);
router.get('/getTrailReadingByTrailId/:trailId',TrailReadingController.getTrailReadingsByTrailId);
router.put('/updateReadings',TrailReadingController.updatedTrialReading);
router.delete('/deleteReadings/:trialId',TrailReadingController.deleteTrailReading);