import PatientExerciseService from './patient_exercise_service.js'
import AppError from "../../core/util/error_handler/custom_error_message.js";

export default {
    createPatientExercise,
    getPatientExerciseByExerciseId,
    getPatientExerciseByPatientId,
    updatePatientExercise,
    updateCalibration,
    // deletePatientExercise
    deleteExerciseByExerciseId,
    deleteExercisesByPatient
}

async function createPatientExercise(req,res,next){
    try{
        const body = req.body ?? {};
        const patientExercise = await PatientExerciseService.createPatientExercise(body)
        res.status(200).json({
            status: "success",
            message: "Successfully created", })
    }catch (err){
        const error = new AppError(err.message, 400);
        next(error);    
    }
}

async function getPatientExerciseByExerciseId(req, res, next) {
    try {
      const { exerciseId } = req.params;
      const patientExercise = await PatientExerciseService.getPatientExerciseByExerciseId(exerciseId);
      res.status(200).json({
        status: 'success',
        data: {
          patientExercise,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async function getPatientExerciseByPatientId(req, res, next) {
    try {
      const { patientId } = req.params;
      const patientExercise = await PatientExerciseService.getPatientExerciseByPatientId(patientId);
      
      res.status(200).json({
        status: 'success',
        data: {
          patientExercise,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async function updatePatientExercise(req, res, next) {
    try {
      const updatedPatientExercise = await PatientExerciseService.updatePatientExercise(req.body);
      
      res.status(200).json({
        status: 'success',
        data: updatedPatientExercise,
      });
    } catch (err) {
      next(err);
    }
  }

  async function updateCalibration(req, res, next) {
    try {
      const { exerciseId } = req.params;
      const { calibration } = req.body;
  
      const updatedPatientExercise = await PatientExerciseService.updateCalibration(exerciseId, calibration);
  
      res.status(200).json({
        status: 'success',
        data: updatedPatientExercise,
      });
    } catch (err) {
      next(err);
    }
  }

  async function deleteExerciseByExerciseId(req, res, next) {
    try {
      const { exerciseId } = req.params;
  
      const deletedPatientExercise = await PatientExerciseService.deleteExerciseByExerciseId(exerciseId);
  
      res.status(200).json({
        status: 'success',
        data: deletedPatientExercise,
      });
    } catch (err) {
      next(err);
    }
  }

  async function deleteExercisesByPatient(req, res, next) {
    try {
      const { patientId } = req.params;
  
      const deletedExercises = await PatientExerciseService.deleteExercisesByPatientId(patientId);
  
      res.status(200).json({
        status: 'success',
        data: deletedExercises,
      });
    } catch (err) {
      next(err);
    }
  }