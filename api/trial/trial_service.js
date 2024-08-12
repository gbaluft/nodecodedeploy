import SessionSchema from "../patientexercise/patient_exercise_schema.js";
import TrialSchema from "./trial_schema.js";
import Patient from "../patient/patient_schema.js";

// import profileService from "../profile/profile_service.js";
import AppError from "../../core/util/error_handler/custom_error_message.js";
import { v4 as uuidv4 } from "uuid";
import xlsx from "xlsx";
import path from "path";
import { fileURLToPath } from "url";
// Convert module URL to file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  createTrial,
  // getTrialById,
  getTrialDetails,
  getTrialsByExerciseId,
  updateTrial,
  // deleteTrial,
  deleteTrialById,
  downloadTrialDetails,
};

async function createTrial(body) {
  // console.log(body,'body')
  if (!body || Object.keys(body).length === 0) {
    throw new AppError("Invalid body parameter", 400);
  }
  const patientExists = await Patient.findOne({ patientId: body.patientId });
  // console.log(`Patient not found with patientId: ${body.patientId}`);
  if (!patientExists) {
    throw new AppError("Patient not found", 404);
  }

  const exerciseExists = await SessionSchema.findOne({
    exerciseId: body.exerciseId,
  });
  if (!exerciseExists) {
    throw new AppError("Exercise not found", 404);
  }
  const trialDetails = new TrialSchema({
    trialId: uuidv4(),
    trialName: body.trialName,
    // trialDate: body.trialDate,
    trialDate: new Date(),
    // exercise: body.exercise,
    calibration: {
      calibrationId: uuidv4(),
      ...body.calibration,
    },
    patientId: body.patientId,
    exerciseId: body.exerciseId,
    profileId: body.profileId,
    profileName: body.profileName,
    position: body.position,
    positionId: body.positionId,
    // profile: body.profile,
    appreciationStimulus: body.appreciationStimulus,
    onDemandStimulus: body.onDemandStimulus,
    initialStimulus: body.initialStimulus,
    startTime: new Date(),
    endTime: body.endTime,
    remarks: body.remarks,
    completionRemarks: body.completionRemarks,
    exerciseCompletedFully: body.exerciseCompletedFully,
    optimalThreshold: body.optimalThreshold,
    deviceAddress: body.deviceAddress,
    trialStatus: body.trialStatus,
    createdBy: body.patientId,
    createdDate: new Date(),
    updateSessionCalibration: body.updateSessionCalibration || false,
  });

  await trialDetails.save();
  if (trialDetails.updateSessionCalibration) {
    await SessionSchema.updateMany(
      { exerciseId: trialDetails.exerciseId },
      { $set: { calibration: trialDetails.calibration } }
    );
  }
  return trialDetails;
}

// async function createTrial(body) {
//   if (!body || Object.keys(body).length === 0) {
//     throw new AppError("Invalid body parameter", 400);
//   }

//   const patientExists = await Patient.findOne({ patientId: body.patientId });
//   console.log(`Patient not found with patientId: ${body.patientId}`);
//   if (!patientExists) {
//     throw new AppError("Patient not found", 404);
//   }

//   const exerciseExists = await trialSchema.PatientExercise.findOne({ exerciseId: body.exerciseId });
//   if (!exerciseExists) {
//     throw new AppError("Exercise not found", 404);
//   }

//   // Integrate the profile and trial services
//   const profileDetails = await profileService.createProfile(body.profile);

//   const trialDetails = new trialSchema.Trial ();
//   trialDetails.trialId = uuidv4();
//   trialDetails.trialName = body.trialName;
//   trialDetails.trialDate = body.trialDate;
//   trialDetails.exerciseId = body.exerciseId;
//   trialDetails.calibration = body.calibration;
//   trialDetails.patientId = body.patientId;
//   trialDetails.profileId = profileDetails.profileId;
//   trialDetails.profileName = profileDetails.profileName;
//   trialDetails.position = body.position;
//   trialDetails.positionId = body.positionId;
//   trialDetails.profile = profileDetails;
//   trialDetails.appreciationStimulus = body.appreciationStimulus;
//   trialDetails.onDemandStimulus = body.onDemandStimulus;
//   trialDetails.initialStimulus = body.initialStimulus;
//   trialDetails.startTime = body.startTime;
//   trialDetails.endTime = body.endTime;
//   trialDetails.remarks = body.remarks;
//   trialDetails.completionRemarks = body.completionRemarks;
//   trialDetails.exerciseCompletedFully = body.exerciseCompletedFully;
//   trialDetails.optimalThreshold = body.optimalThreshold;
//   trialDetails.createdTime = new Date();

//   await trialDetails.save();

//   return trialDetails;
// }
// async function getTrialById(id) {
//   const trial = await trialSchema.Trial.findById(id).populate('exercise profile');
//   if (!trial) {
//     throw new AppError('Trial not found', 404);
//   }
//   return trial;
// }
// // without profile object
// async function getTrialDetails(trialId) {
//   if (!trialId) {
//     throw new Error('Invalid trialId parameter');
//   }

//   const trialDetails = await TrialSchema.Trial.findOne({ trialId });

//   if (!trialDetails) {
//     throw new Error('Trial not found');
//   }

//   return trialDetails;
// }

// with profile object
async function getTrialDetails(trialId) {
  if (!trialId) {
    throw new AppError("Invalid trialId parameter", 400);
  }

  const result = await TrialSchema.aggregate([
    {
      $match: { trialId: trialId },
    },
    {
      $lookup: {
        from: "Profile",
        localField: "profileId",
        foreignField: "profileId",
        as: "profile",
      },
    },
    {
      $unwind: "$profile",
    },
    {
      $lookup: {
        from: "Session",
        localField: "exerciseId",
        foreignField: "exerciseId",
        as: "exerciseDetails",
      },
    },
    {
      $unwind: "$exerciseDetails",
    },
    {
      $lookup: {
        from: "Module",
        localField: "exerciseDetails.moduleId",
        foreignField: "moduleId",
        as: "moduleDetails",
      },
    },
    {
      $unwind: "$moduleDetails",
    },
    {
      $lookup: {
        from: "Patient",
        localField: "patientId",
        foreignField: "patientId",
        as: "patientInfo",
      },
    },
    {
      $unwind: "$patientInfo",
    },
    {
      $project: {
        trialId: 1,
        trialName: 1,
        trialDate: 1,
        calibration: 1,
        patientId: 1,
        exerciseId: 1,
        profileId: 1,
        profileName: 1,
        position: 1,
        positionId: 1,
        appreciationStimulus: 1,
        onDemandStimulus: 1,
        initialStimulus: 1,
        startTime: 1,
        endTime: 1,
        remarks: 1,
        completionRemarks: 1,
        exerciseCompletedFully: 1,
        optimalThreshold: 1,
        deviceAddress: 1,
        trialStatus: 1,
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
          createdTime: 1,
        },
        exerciseDetails: {
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
        },
        moduleDetails: {
          moduleId: 1,
          description: 1,
          motionPlane: 1,
          exerciseName: 1,
          exercise: 1,
          exerciseAttributes: 1,
        },
        profile: {
          profileId: 1,
          profileName: 1,
          auditoryStimulus: 1,
          auditoryFeedback: 1,
          visualFeedback: 1,
          isActive: 1,
          appreciationFeedback: 1,
        },
      },
    },
  ]);

  if (!result || result.length === 0) {
    throw new AppError("Trial not found", 404);
  }

  return result[0];
}

// // without exercise object
// async function getTrialsByExerciseId(exerciseId) {
//   if (!exerciseId) {
//     throw new AppError('Invalid exerciseId parameter',400);
//   }

//   const trials = await TrialSchema.Trial.findOne({ exerciseId });

//   if (!trials || trials.length === 0) {
//     throw new AppError('No trials found for the given exerciseId',404);
//   }

//   return trials;
// }
// // with exercise object
async function getTrialsByExerciseId(exerciseId) {
  if (!exerciseId) {
    throw new AppError("Invalid exerciseId parameter", 400);
  }
  const trials = await TrialSchema.aggregate([
    {
      $match: {
        exerciseId: exerciseId,
      },
    },
    {
      $lookup: {
        from: "Session",
        localField: "exerciseId",
        foreignField: "exerciseId",
        as: "exercise",
      },
    },
    {
      $unwind: "$exercise",
    },
    {
      $project: {
        trialId: 1,
        trialName: 1,
        trialDate: 1,
        calibration: 1,
        patientId: 1,
        exerciseId: 1,
        profileId: 1,
        profileName: 1,
        position: 1,
        positionId: 1,
        appreciationStimulus: 1,
        onDemandStimulus: 1,
        initialStimulus: 1,
        startTime: 1,
        endTime: 1,
        remarks: 1,
        completionRemarks: 1,
        exerciseCompletedFully: 1,
        optimalThreshold: 1,
        deviceAddress: 1,
        trialStatus: 1,
        // 'exercise.patientId': '$exercise.patientId',
        exercise: {
          patientId: 1,
          exerciseId: 1,
          sessionDate: 1,

          moduleId: 1,
          // exerciseAttributes: 1,
          sessionName: 1,
          deviceAddress: 1,
          createdTime: 1,
          endTime: 1,
          remarks: 1,
          lastTrailDate: 1,
        },
      },
    },
  ]);
  if (!trials || trials.length === 0) {
    throw new AppError("No trials found for the given exerciseId", 404);
  }

  return trials;
}

async function updateTrial(body) {
  if (!body.trialId) {
    throw new Error("Provide trialId", 400);
  }

  const updatedTrial = await TrialSchema.findOneAndUpdate(
    { trialId: body.trialId },
    {
      $set: {
        trialName: body.trialName,
        trialDate: body.trialDate,
        calibration: body.calibration,
        patientId: body.patientId,
        exerciseId: body.exerciseId,
        profileId: body.profileId,
        profileName: body.profileName,
        position: body.position,
        positionId: body.positionId,
        appreciationStimulus: body.appreciationStimulus,
        onDemandStimulus: body.onDemandStimulus,
        initialStimulus: body.initialStimulus,
        startTime: body.startTime,
        endTime: body.endTime,
        remarks: body.remarks,
        completionRemarks: body.completionRemarks,
        exerciseCompletedFully: body.exerciseCompletedFully,
        optimalThreshold: body.optimalThreshold,
        deviceAddress: body.deviceAddress,
        trialStatus: body.trialStatus,
        updatedBy: body.patientId,
        updatedDate: new Date(),
      },
    },
    { new: true } // use runValidators: true here for validation applied
  );

  if (!updatedTrial) {
    throw new Error("Trial not found", 404);
  }

  return updatedTrial;
}
// async function updateTrial(body) {
//   if (!body._id) {
//     throw new AppError("Provide _id", 400);
//   }

//   const updatedTrial = await trialSchema.Trial.findByIdAndUpdate(
//     body._id,
//     {
//       $set: {
//         trialId: body.trialId,
//         trialName: body.trialName,
//         trialDate: body.trialDate,
//         exercise: body.exercise,
//         callibration: body.callibration,
//         patientId: body.patientId,
//         exerciseId: body.exerciseId,
//         profileId: body.profileId,
//         profileName: body.profileName,
//         position: body.position,
//         positionId: body.positionId,
//         profile: body.profile,
//         appreciationStimulus: body.appreciationStimulus,
//         onDemandStimulus: body.onDemandStimulus,
//         initialStimulus: body.initialStimulus,
//         startTime: new Date(),
//         endTime: body.endTime,
//         remarks: body.remarks,
//         completionRemarks: body.completionRemarks,
//         exerciseCompletedFully: body.exerciseCompletedFully,
//         optimalThreshold: body.optimalThreshold,
//         deviceAddress: body.deviceAddress,
//         trialStatus: body.trialStatus,
//         updatedBy: body.updatedBy,
//         updatedDate: new Date(),
//       },
//     },
//     { new: true }
//   );

//   if (!updatedTrial) {
//     throw new AppError("Trial not found", 404);
//   }

//   return updatedTrial;
// }
async function deleteTrialById(trialId) {
  if (!trialId) {
    throw new AppError("Invalid trialId parameter", 400);
  }

  const result = await TrialSchema.deleteOne({ trialId });

  if (result.deletedCount === 0) {
    throw new AppError("Trial not found", 404);
  }

  return result;
}
// async function deleteTrial(id) {
//   if (!id) {
//     throw new AppError("Provide id", 400);
//   }

//   const result = await trialSchema.Trial.findByIdAndDelete(id);
//   if (!result) {
//     throw new AppError("Trial not found", 404);
//   }

//   return "Successfully Deleted";
// }

const flattenObject = (obj, parent = "", res = {}) => {
  for (let key in obj) {
    let propName = parent ? parent + "_" + key : key;
    if (typeof obj[key] == "object" && obj[key] !== null) {
      flattenObject(obj[key], propName, res);
    } else {
      res[propName] = obj[key];
    }
  }
  return res;
};
async function downloadTrialDetails(trialId) {
  if (!trialId) {
    throw new AppError("Invalid trialId parameter", 400);
  }

  const result = await TrialSchema.aggregate([
    {
      $match: { trialId: trialId },
    },
    {
      $lookup: {
        from: "Profile",
        localField: "profileId",
        foreignField: "profileId",
        as: "profile",
      },
    },
    {
      $unwind: "$profile",
    },
    {
      $lookup: {
        from: "Session",
        localField: "exerciseId",
        foreignField: "exerciseId",
        as: "exerciseDetails",
      },
    },
    {
      $unwind: "$exerciseDetails",
    },
    {
      $lookup: {
        from: "Module",
        localField: "exerciseDetails.moduleId",
        foreignField: "moduleId",
        as: "moduleDetails",
      },
    },
    {
      $unwind: "$moduleDetails",
    },
    {
      $lookup: {
        from: "Patient",
        localField: "patientId",
        foreignField: "patientId",
        as: "patientInfo",
      },
    },
    {
      $unwind: "$patientInfo",
    },
    {
      $project: {
        trialId: 1,
        trialName: 1,
        trialDate: 1,
        calibration: 1,
        patientId: 1,
        exerciseId: 1,
        profileId: 1,
        profileName: 1,
        position: 1,
        positionId: 1,
        appreciationStimulus: 1,
        onDemandStimulus: 1,
        initialStimulus: 1,
        startTime: 1,
        endTime: 1,
        remarks: 1,
        completionRemarks: 1,
        exerciseCompletedFully: 1,
        optimalThreshold: 1,
        deviceAddress: 1,
        trialStatus: 1,
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
          createdTime: 1,
        },
        exerciseDetails: {
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
        },
        moduleDetails: {
          moduleId: 1,
          description: 1,
          motionPlane: 1,
          exerciseName: 1,
          exercise: 1,
          exerciseAttributes: 1,
        },
        profile: {
          profileId: 1,
          profileName: 1,
          auditoryStimulus: 1,
          auditoryFeedback: 1,
          visualFeedback: 1,
          isActive: 1,
          appreciationFeedback: 1,
        },
      },
    },
  ]);

  if (!result || result.length === 0) {
    throw new AppError("Trial not found", 404);
  }
  // const workbook = xlsx.utils.book_new();
  // const worksheet = xlsx.utils.json_to_sheet(result);

  // xlsx.utils.book_append_sheet(workbook, worksheet, 'TrialDetails');// Append worksheet to workbook

  // const filePath = path.join(__dirname, 'trialDetails.xlsx');// Create a temporary file path

  // xlsx.writeFile(workbook, filePath);// Write the workbook to the temporary file

  const trial = result.map(
    ({
      trialId,
      trialName,
      trialDate,
      calibration,
      patientId,
      exerciseId,
      profileId,
      position,
      positionId,
      appreciationStimulus,
      onDemandStimulus,
      initialStimulus,
      startTime,
      endTime,
      remarks,
      completionRemarks,
      exerciseCompletedFully,
      optimalThreshold,
      deviceAddress,
      trialStatus,
    }) =>
      flattenObject({
        trialId,
        trialName,
        trialDate,
        calibration,
        patientId,
        exerciseId,
        profileId,
        position,
        positionId,
        appreciationStimulus,
        onDemandStimulus,
        initialStimulus,
        startTime,
        endTime,
        remarks,
        completionRemarks,
        exerciseCompletedFully,
        optimalThreshold,
        deviceAddress,
        trialStatus,
      })
  );
  const profile = result.map((r) => flattenObject(r.profile));
  const patientInfo = result.map((r) => flattenObject(r.patientInfo));

  const combinedDetails = result.map((r) =>
    flattenObject({
      ...r.exerciseDetails,
      ...r.moduleDetails,
    })
  );

  // const trial = result.map(({ trialId, trialName, trialDate, calibration, patientId, exerciseId, profileId, position, positionId, appreciationStimulus, onDemandStimulus, initialStimulus, startTime, endTime, remarks, completionRemarks, exerciseCompletedFully, optimalThreshold, deviceAddress, trialStatus }) => ({ trialId, trialName, trialDate, calibration, patientId, exerciseId, profileId, position, positionId, appreciationStimulus, onDemandStimulus, initialStimulus, startTime, endTime, remarks, completionRemarks, exerciseCompletedFully, optimalThreshold, deviceAddress, trialStatus }));
  // const profile = result.map(r => r.profile);
  // const patientInfo = result.map(r => r.patientInfo);

  // const combinedDetails = result.map(r => ({
  //   ...r.exerciseDetails,
  //   ...r.moduleDetails
  // }));

  const workbook = xlsx.utils.book_new();

  const trialSheet = xlsx.utils.json_to_sheet(trial);
  xlsx.utils.book_append_sheet(workbook, trialSheet, "Trial");

  const profileSheet = xlsx.utils.json_to_sheet(profile);
  xlsx.utils.book_append_sheet(workbook, profileSheet, "Profile");

  const combinedSheet = xlsx.utils.json_to_sheet(combinedDetails);
  xlsx.utils.book_append_sheet(
    workbook,
    combinedSheet,
    "ExerciseDetails and Module"
  );

  const patientInfoSheet = xlsx.utils.json_to_sheet(patientInfo);
  xlsx.utils.book_append_sheet(workbook, patientInfoSheet, "PatientInfo");

  const filePath = path.join(__dirname, "trialDetails.xlsx");

  xlsx.writeFile(workbook, filePath);

  return filePath;
}
