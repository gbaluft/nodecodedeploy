import Router from 'express';
import PatientController from  './patient_controller.js';
import ProtectRoute from '../../core/authentication/auth.js'
const router = Router();

export default router;

// router.post('/createPatient',ProtectRoute.protect,ProtectRoute.authorizeRoles('superadmin','admin','doctor'),PatientController.createPatient);
router.post('/addPatient',PatientController.createPatient);
// router.get('/getPatientList',ProtectRoute.protect,PatientController.getPatientList);
router.get('/allPatients',PatientController.getPatientList);
router.get('/patientInfo/:patientId',PatientController.getPatientById);
router.get('/filter',PatientController.filterPatients);
// router.put('/updatePatient',ProtectRoute.protect,PatientController.updatePatient);
router.put('/updatePatient',PatientController.updatePatient);
router.delete('/deletePatient/:patientId',PatientController.deletePatientById);
router.delete('/deleteAll',PatientController.deleteAllPatients);
// router.delete('/deletePatient',ProtectRoute.protect,PatientController.deletePatient)