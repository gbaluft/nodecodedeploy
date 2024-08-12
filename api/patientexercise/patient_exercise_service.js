import PatientExercise from "./patient_exercise_schema.js";
import { v4 as uuidv4 } from "uuid";
import Patient from "../patient/patient_schema.js";
import Trial from "../trial/trial_schema.js";
import AppError from "../../core/util/error_handler/custom_error_message.js";

export default {
  createPatientExercise,
  getPatientExerciseByExerciseId,
  getPatientExerciseByPatientId,
  updatePatientExercise,
  updateCalibration,
  // deletePatientExercise,
  deleteExerciseByExerciseId,
  deleteExercisesByPatientId
};

async function createPatientExercise(body) {
  if (!body || Object.keys(body).length === 0) {
    throw new AppError("Invalid body parameter", 400);
  }
  const patient = await Patient.findOne({ patientId: body.patientId });
  if (!patient) {
    throw new AppError("Patient not found", 404);
  }
  const patientExerciseDetails = new PatientExercise({
    patientId: body.patientId,
    exerciseId: uuidv4(),
    // patientInfo: {
    //   patientId: patient.patientId,
    //   firstName: patient.firstName,
    //   lastName: patient.lastName,
    //   gender: patient.gender,
    //   dateOfBirth: patient.dateOfBirth,
    //   address: patient.address,
    //   mobileNumber: patient.mobileNumber,
    //   guardianName: patient.guardianName,
    //   primaryProblem: patient.primaryProblem,
    //   surgeries: patient.surgeries,
    //   hospitalization: patient.hospitalization,
    //   treatments: patient.treatments,
    //   allergies: patient.allergies,
    //   medicalProblems: patient.medicalProblems,
    //   lastTrial: patient.lastTrial,
    //   createdTime: patient.createdTime,
    //   remark: patient.remark,
    //   isActive: patient.isActive,
    // },
    sessionDate: new Date(),
    calibration: {
      calibrationId: uuidv4(),
      ...body.calibration,
    },
    moduleId:body.moduleId,
    // module: {
    //   // moduleId: uuidv4(),
    //   moduleId: body.moduleId,
    //   ...body.module,
    // },
    positionId: uuidv4(),
    sessionName: body.sessionName,
    deviceAddress: body.deviceAddress,
    createdTime: new Date(),
    endTime: body.endTime,
    remarks: body.remarks,
    // lastTrailDate: body.lastTrialDate,
  });
  // const patientExerciseDetails = new PatientSchema.PatientExercise({
  //     patientId: body.patientId,
  //     exerciseId: body.exerciseId,
  //     patientInfo: body.patientInfo,
  //     sessionDate: body.sessionDate,
  //     trails: body.trials,
  //     callibration: body.callibration,
  //     moduleId: body.moduleId,
  //     module: body.module,
  //     positionId: body.positionId,
  //     sessionName: body.sessionName,
  //     deviceAddress: body.deviceAddress,
  //     createdTime: new Date(),
  //     endTime: body.endtime,
  //     remarks: body.remarks,
  //     lastTrailDate: body.lastTrailDate

  // });
  await patientExerciseDetails.save();
  return patientExerciseDetails;
}

async function getPatientExerciseByExerciseId(exerciseId) {
  if (!exerciseId) {
    throw new AppError("Provide exerciseId", 400);
  }
  const patientExercise = await PatientExercise.findOne({
    exerciseId,
  });
  if (!patientExercise) {
    throw new AppError("PatientExercise not found", 404);
  }
  return patientExercise;
}

// async function getPatientExerciseById(id) {
//   const patientExercise = await PatientSchema.PatientExercise.findById(id);
//   if (!patientExercise) {
//     throw new AppError("PatientExercise not found", 404);
//   }
//   return patientExercise;
// }

// async function getPatientExerciseByPatientId(patientId) {
//   if (!patientId) {
//     throw new AppError("Provide patientId", 400);
//   }
//   const patientExercise = await PatientExerciseSchema.PatientExercise.findOne({patientId});
//   if (!patientExercise) {
//     throw new AppError("PatientExercise not found", 404);
//   }
//   return patientExercise;
// }

async function getPatientExerciseByPatientId(patientId) {
  if (!patientId) {
    throw new AppError("Provide patientId", 400);
  }

  const result = await PatientExercise.aggregate([
    {
      $match: { patientId: patientId }
    },
    {
      $lookup: {
        from: 'Patient', 
        localField: 'patientId',
        foreignField: 'patientId',
        as: 'patientInfo'
      }
    },
    {
      $unwind: '$patientInfo' 
    },
    {
      $project: {
        _id: 1,
        patientId: 1,
        exerciseId: 1,
        sessionDate: 1,
        calibration: 1,
        moduleId: 1,
        positionId: 1,
        sessionName: 1,
        deviceAddress: 1,
        createdTime: 1,
        endTime: 1,
        remarks: 1,
        lastTrailDate: 1,
        patientInfo: {
          patientId: 1,
          firstName: 1,
          lastName: 1,
          gender: 1,
          dateOfBirth: 1,
          address: 1,
          mobileNumber: 1,
          guardianName: 1,
          primaryProblem: 1,
          surgeries: 1,
          hospitalization: 1,
          treatments: 1,
          allergies: 1,
          medicalProblems: 1,
          lastTrial: 1,
          createdTime: 1,
          remark: 1,
          isActive: 1
        }
      }
    }
  ]);


  if (!result || result.length === 0) {
    throw new AppError("PatientExercise not found", 404);
  }

  return result[0]; 
}

async function updatePatientExercise(body) {
  if (!body.exerciseId) {
    throw new AppError("Provide patientId", 400);
  }
  const updatedPatientExercise =
    await PatientExercise.findOneAndUpdate({ exerciseId:body.exerciseId}
     ,
      {
        $set: {
          // patientId: body.patientId,
          // exerciseId: body.exerciseId,
          // patientInfo: body.patientInfo,
          sessionDate: body.sessionDate,
          // trials: body.trials,
          calibration: body.calibration,
          // moduleId: body.moduleId,
          module: body.module,
          // positionId: body.positionId,
          sessionName: body.sessionName,
          deviceAddress: body.deviceAddress,
          createdTime: body.createdTime,
          endTime: body.endTime,
          remarks: body.remarks,
          lastTrailDate: body.lastTrailDate,
          updatedBy: body.patientId,
          updatedDate: new Date(),
        },
      },
      { new: true }
    );
  if (!updatedPatientExercise) {
    throw new AppError("PatientExercise not found", 404);
  }
  return updatedPatientExercise;
}

async function updateCalibration(exerciseId, calibration) {
  if (!exerciseId) {
    throw new AppError("Provide exerciseId", 400);
  }

  // Validate calibration fields
  // const requiredFields = ['calibrationId', 'positionZero', 'optimalPosition', 'maxPosition', 'auditoryFeedback', 'auditoryStimulus'];
  // for (const field of requiredFields) {
  //   if (calibration[field] === undefined) {
  //     throw new AppError(`Provide ${field}`, 400);
  //   }
  // }

  const updatedPatientExercise = await PatientExercise.findOneAndUpdate(
    { exerciseId: exerciseId }, 
    {
      $set: {
        'calibration.calibrationId': calibration.calibrationId,
        'calibration.positionZero': calibration.positionZero,
        'calibration.optimalPosition': calibration.optimalPosition,
        'calibration.maxPosition': calibration.maxPosition,
        'calibration.auditoryFeedback': calibration.auditoryFeedback,
        'calibration.auditoryStimulus': calibration.auditoryStimulus,
        updatedDate: new Date(),
      },
    },
    { new: true } 
  );

  if (!updatedPatientExercise) {
    throw new AppError("PatientExercise not found", 404);
  }

  return updatedPatientExercise;
}

// async function deletePatientExercise(id) {
//   if (!id) {
//     throw new AppError("Provide id", 400);
//   }
//   const result = await PatientSchema.PatientExercise.findByIdAndDelete(id);
//   if (!result) {
//     throw new AppError("PatientExercise not found", 404);
//   }
//   return "Successfully Deleted";
// }
async function deleteExerciseByExerciseId(exerciseId) {
  if (!exerciseId) {
    throw new AppError("Provide exerciseId", 400);
  }
  await Trial.deleteMany({ exerciseId });
  const deletedPatientExercise = await PatientExercise.findOneAndDelete(
    { exerciseId: exerciseId } 
  );

  if (!deletedPatientExercise) {
    throw new AppError("PatientExercise not found", 404);
  }

  return "Successfully deleted";
}

async function deleteExercisesByPatientId(patientId) {
  if (!patientId) {
    throw new AppError("Provide patientId", 400);
  }
  await Trial.deleteMany({ patientId });
  const deletedExercises = await PatientExercise.deleteMany(
    { patientId: patientId } 
  );

  if (deletedExercises.deletedCount === 0) {
    throw new AppError("No exercises found for the given patientId", 404);
  }

  return deletedExercises;
}
