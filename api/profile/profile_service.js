import { v4 as uuidv4 } from "uuid";
import ProfileSchema from "./profile_schema.js";
import Patient from "../patient/patient_schema.js";
import AppError from "../../core/util/error_handler/custom_error_message.js";

async function createProfile(body) {
  if (!body || Object.keys(body).length === 0) {
    throw new AppError("Invalid body parameter", 400);
  }
  // const patient = await Patient.findOne({ patientId: body.patientId });
  // if (!patient) {
  //   throw new AppError("Patient not found", 404);
  // }

  const profileDetails = new ProfileSchema({
    profileId: uuidv4(),
    profileName: body.profileName,
    auditoryStimulus: body.auditoryStimulus,
    auditoryFeedback: body.auditoryFeedback,
    visualFeedback: body.visualFeedback,
    stimulusFile1: body.stimulusFile1,
    stimulusFile2: body.stimulusFile2,
    stimulusFile3: body.stimulusFile3,
    // isActive: body.isActive,
    appreciationFeedback: body.appreciationFeedback,
    isActive: "Y",
    activeStartDate: new Date(),
    // createdBy: body.patientId,
    createdDate: new Date(),
  });

  await profileDetails.save();
  return profileDetails;
}

// async function getProfileById(id) {
//   const profile = await ProfileSchema.findById(id);
//   if (!profile) {
//     throw new AppError("Profile not found", 404);
//   }
//   return profile;
// }
//get profilebyprofileid (harddelete)
// async function getProfileByProfileId(profileId) {
//   if (!profileId) {
//     throw new AppError("Invalid profileId parameter", 400);
//   }
//   const profile = await ProfileSchema.findOne({ profileId });
//   if (!profile) {
//     throw new AppError("Profile not found", 404);
//   }
//   return profile;
// }
async function getProfileByProfileId(profileId) {
  if (!profileId) {
    throw new AppError("Invalid profileId parameter", 400);
  }

  const profile = await ProfileSchema.findOne({ profileId, isActive: 'Y' });
  if (!profile) {
    throw new AppError("Profile not found", 404);
  }
  return profile;
}

async function getProfiles (){
  const profiles = await ProfileSchema.find({ isActive: 'Y' });
  if (!profiles || profiles.length === 0) {
    throw new AppError("No profiles found", 404);
  }
  return profiles;
}

// async function updateProfile(body) {
//   if (!body._id) {
//     throw new AppError("Provide _id", 400);
//   }

//   const updatedProfile = await ProfileSchema.findByIdAndUpdate(
//     body._id,
//     {
//       $set: {
//         profileName: body.profileName,
//         auditoryStimulus: body.auditoryStimulus,
//         auditoryFeedback: body.auditoryFeedback,
//         visualFeedback: body.visualFeedback,
//         isActive: body.isActive,
//         appreciationFeedback: body.appreciationFeedback,
//         updatedBy: body.profileId,
//         updatedDate: new Date(),
//       },
//     },
//     { new: true }
//   );

//   if (!updatedProfile) {
//     throw new AppError("Profile not found", 404);
//   }

//   return updatedProfile;
// }
async function updateProfile(body) {
  if (!body.profileId) {
    throw new AppError("Provide profileId", 400);
  }

  const updatedProfile = await ProfileSchema.findOneAndUpdate(
    { profileId: body.profileId, isActive: 'Y' }, // added isActive field for softdelete actions
    {
      $set: {
        profileName: body.profileName,
        auditoryStimulus: body.auditoryStimulus,
        auditoryFeedback: body.auditoryFeedback,
        visualFeedback: body.visualFeedback,
        isActive: body.isActive,
        appreciationFeedback: body.appreciationFeedback,
        updatedBy: body.profileId,
        updatedDate: new Date(),
      },
    },
    { new: true }
  );

  if (!updatedProfile) {
    throw new AppError("Profile not found", 404);
  }

  return updatedProfile;
}

//  async function deleteProfile (id) {
//   if (!id) {
//     throw new AppError("Provide profileId", 400);
//   }

//   const profile = await ProfileSchema.findByIdAndDelete(id);
//   if (!profile) {
//     throw new AppError("Profile not found", 404);
//   }
// };

//hard delete profileFile

// async function deleteProfile(profileId) {
//   if (!profileId) {
//     throw new AppError("Provide profileId", 400);
//   }

//   const profile = await ProfileSchema.findOneAndDelete(profileId);
//   if (!profile) {
//     throw new AppError("Profile not found", 404);
//   }
// }

async function deleteProfile(profileId) {
  if (!profileId) {
    throw new AppError("Provide profileId", 400);
  }

  const profile = await ProfileSchema.findOneAndUpdate(
    { profileId },
    { $set: { isActive: "N", updatedDate: new Date() } },
    { new: true }
  );

  if (!profile) {
    throw new AppError("Profile not found", 404);
  }

  return profile;
}

const getAllProfileFilePaths = async (profileId) => {
  const profile = await ProfileSchema.findOne({ profileId });

  if (!profile) {
    throw new Error("Profile not found");
  }

  const fileProperties = [
    "auditoryStimulus",
    "auditoryFeedback",
    "visualFeedback",
    "appreciationFeedback",
  ];
  const filePaths = fileProperties
    .map((prop) => profile[prop]?.filePath)
    .filter((filePath) => filePath);
  console.log(filePaths);
  return filePaths;
};

async function getProfileByfileProperty(profileId,fileProperty){
  const profile = await ProfileSchema.findOne({profileId});
  if (!profile){
    throw new AppError ('Profile not found');
  }
  const fileDetails = profile[fileProperty];
  console.log(fileDetails,'fileDetails')
  if (!fileDetails){
    throw new AppError (`${fileProperty} not found`);
  }
  if (fileDetails.filePath) {
    return fileDetails.filePath;
  } else {
    throw new AppError(`${fileProperty} does not have a filePath`);
  }
 
}



export default {
  createProfile,
  // getProfileById,
  getProfileByProfileId,
  updateProfile,
  deleteProfile,
  getAllProfileFilePaths,
  getProfiles,
  getProfileByfileProperty
};
