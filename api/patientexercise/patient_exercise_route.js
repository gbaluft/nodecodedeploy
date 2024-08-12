import Router from 'express';
import PatientExerciseController from './patient_exercise_controller.js';
import ProtectRoute from '../../core/authentication/auth.js'
const router = Router();

export default router;

// router.post ('/createPatientExercise',PatientExerciseController.createPatientExercise);
router.post('/addExercise',PatientExerciseController.createPatientExercise);
router.get('/exerciseDetails/:exerciseId',PatientExerciseController.getPatientExerciseByExerciseId);
router.get('/exercises/:patientId',PatientExerciseController.getPatientExerciseByPatientId);
router.put('/update',PatientExerciseController.updatePatientExercise);
router.put('/updateCalibration/:exerciseId',PatientExerciseController.updateCalibration);
router.delete('/delete/:exerciseId',PatientExerciseController.deleteExerciseByExerciseId);
router.delete('/deleteByPatient/:patientId',PatientExerciseController.deleteExercisesByPatient);