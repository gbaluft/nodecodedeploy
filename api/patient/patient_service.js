import { Types } from "mongoose";
import Patient from "./patient_schema.js";
import PatientExercise from "../patientexercise/patient_exercise_schema.js";
import Trial from "../trial/trial_schema.js";
import AppError from "../../core/util/error_handler/custom_error_message.js";
import { v4 as uuidv4 } from "uuid";
import User from "../user/user_schema.js";
import patient, { GenderEnum } from "./patient_schema.js";

export default {
  createPatient,
  getPatientsList,
  getPatientById,
  updatePatient,
  deletePatientById,
  filterPatients,
  deleteAllPatients
};

async function createPatient(body) {
  if (!body || Object.keys(body).length === 0) {
    throw new AppError("Invalid body parameter", 400);
  }
  if (
    ![GenderEnum.MALE, GenderEnum.FEMALE, GenderEnum.OTHER].includes(
      body.gender
    )
  ) {
    throw new AppError("Invalid gender value", 400);
  }
  // const { userName, password } = body;
  // if (!userName) {
  //   throw new AppError("Please enter your user name", 400);
  // }
  // if (!password) {
  //   throw new AppError("Please enter a password", 400);
  // }
  const patientDetails = new Patient();
  patientDetails.patientId = uuidv4();
  patientDetails.firstName = body.firstName;
  patientDetails.lastName = body.lastName;
  patientDetails.gender = body.gender;
  patientDetails.dateOfBirth = body.dateOfBirth;
  patientDetails.address = body.address;
  patientDetails.mobileNumber = body.mobileNumber;
  patientDetails.guardianName = body.guardianName;
  patientDetails.primaryProblem = body.primaryProblem;
  patientDetails.surgeries = body.surgeries;
  patientDetails.hospitalization = body.hospitalization;
  patientDetails.treatments = body.treatments;
  patientDetails.allergies = body.allergies;
  patientDetails.medicalProblems = body.medicalProblems;
  // patientDetails.lastTrial = body.lastTrial;
  patientDetails.createdTime = new Date();
  patientDetails.remark = body.remark;
  patientDetails.isActive = "Y";
  // patientDetails.activeStartDate = new Date();
  // patientDetails.activeEndDate = "";
  patientDetails.createdBy = patientDetails.patientId;
  await patientDetails.save();

  // await createUser({
  //   userID: patientDetails._id,
  //   mobileNumber: patientDetails.mobileNumber,
  //   dateOfBirth: patientDetails.dateOfBirth,
  //   remark: patientDetails.remark,
  //   userName : patientDetails.mobileNumber,
  //   password,
  // });

  return patientDetails;
}

// async function createUser({
//   userID,
//   userName,
//   password,
//   mobileNumber,
//   dateOfBirth,
//   remark,
// }) {
//   if (!userID || !userName || !password || !mobileNumber || !dateOfBirth) {
//     throw new AppError("Invalid body parameter", 400);
//   }

//   const findUser = await User.findOne({ userID: userID });
//   if (findUser) {
//     throw new AppError("Already a user exists with this patientId", 409);
//   }

//   if (!findUser) {
//     const userDetails = new User();
//     userDetails.userID = userID;
//     userDetails.userName = userName;
//     userDetails.password = password;
//     userDetails.role = "patient";
//     userDetails.remark = remark;
//     userDetails.isActive = "Y";
//     userDetails.activeStartDate = new Date();
//     userDetails.createdBy = mobileNumber;
//     userDetails.createdDate = new Date();
//     await userDetails.save();
//   }
// }

async function getPatientsList() {
  const patientList = await Patient.aggregate([
    {
      $project: {
        _id: 1,
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
      },
    },
  ]);
  if (!patientList || patientList.length === 0) {
    throw new AppError("No patients found", 404);
  }
  return patientList;
}

async function getPatientById(patientId) {
  if (!patientId) {
    throw new AppError("PatientID is required", 400);
  }
  // const patient = await Patient.findOne({patientId})
  const patient = await Patient.aggregate([
    {
      $match: {
        patientId:patientId
      }
    },

    // getting id of the last trial
    {
      $lookup: {
        from: "Trials",
        localField: "patientId",
        foreignField: "patientId",
        as: "trials"
      }
    },
    {
      $unwind: {
        path: "$trials",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $sort: {
        "trials.trialDate": -1 //descending
      }
    },
    {
      $group: {
        _id: "$_id",
        patientId: {
          $first: "$patientId"
        },
        firstName: {
          $first: "$firstName"
        },
        lastName: {
          $first: "$lastName"
        },
        gender: {
          $first: "$gender"
        },
        dateOfBirth: {
          $first: "$dateOfBirth"
        },
        address: {
          $first: "$address"
        },
        mobileNumber: {
          $first: "$mobileNumber"
        },
        guardianName: {
          $first: "$guardianName"
        },
        primaryProblem: {
          $first: "$primaryProblem"
        },
        surgeries: {
          $first: "$surgeries"
        },
        hospitalization: {
          $first: "$hospitalization"
        },
        treatments: {
          $first: "$treatments"
        },
        allergies: {
          $first: "$allergies"
        },
        medicalProblems: {
          $first: "$medicalProblems"
        },
        createdTime: {
          $first: "$createdTime"
        },
        lastTrial: {
          $first: "$trials.trialId"
        } 
      }
    },
    {
      $project: {
        _id: 0,
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
        createdTime: 1
      }
    }
  ]);
  if (!patient) {
    throw new AppError("No patient found", 404);
  }
  return patient;
}

async function filterPatients(searchTxt) {
  if (!searchTxt) {
    throw new AppError("Search text is required", 400);
  }
  const searchRegex = new RegExp(searchTxt, "i");
  const patientList = await Patient.aggregate([
    {
      $match: {
        $or: [
          {patientId: {$regex: searchRegex}},
          { firstName: { $regex: searchRegex } },
          { lastName: { $regex: searchRegex } },
          { mobileNumber: { $regex: searchRegex } },
          {dateOfBirth: {$regex: searchRegex}}
        ],
      },
    },
    {
      $project:{
        _id:0,
        patientId:1,
        firstName:1,
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
        createdTime: 1
      }
    }
  ]);
  if (patientList.length === 0){
    throw new AppError ('No patients found', 404)
  }
  return patientList;
}

async function updatePatient(body) {
  if (!body.patientId) {
    throw new AppError("Provide patientId", 400);
  }
  const updatedPatient = await Patient.findOneAndUpdate(
    { patientId: body.patientId },
    {
      $set: {
        firstName: body.firstName,
        lastName: body.lastName,
        gender: body.gender,
        dateOfBirth: body.dateOfBirth,
        address: body.address,
        mobileNumber: body.mobileNumber,
        guardianName: body.guardianName,
        primaryProblem: body.primaryProblem,
        surgeries: body.surgeries,
        hospitalization: body.hospitalization,
        treatments: body.treatments,
        allergies: body.allergies,
        medicalProblems: body.medicalProblems,
        // lastTrial:body.lastTrial,
        updatedBy: body.patientId,
        updatedDate: new Date(),
      },
    },
    { new: true }
  );
  if (!updatedPatient) {
    throw new AppError("Patient not found", 404);
  }
  return updatedPatient;
}

async function deletePatientById (patientId){
  if(!patientId){
    throw new AppError('Provide patientId',400);
  }
  await PatientExercise.deleteMany({ patientId });
  await Trial.deleteMany({ patientId });
  const patient = await Patient.deleteOne({patientId})
  // console.log('delPatient',patient)
  if(patient.deletedCount === 0){
    throw new AppError("Patient not found",404)
  }
  return "Successfully deleted";
}

async function deleteAllPatients (){
  const result = await Patient.deleteMany({});
  console.log('deletedpatient',result);

  if(result.deletedCount === 0){
    throw new AppError ("No patients found to delete",404);
  }
  return `${result.deletedCount} patients successfully deleted`
}

// async function deletePatient(patientID) {
//   if (!patientID) {
//     throw new AppError("Provide patientID", 400);
//   }

//   const objectId = new Types.ObjectId(String(patientID));

//   const result = await Patient.findByIdAndDelete(objectId);

//   if (result.deletedCount === 0) {
//     throw new AppError("Patient not found", 404);
//   }

//   return "Successfully Deleted";
// }
