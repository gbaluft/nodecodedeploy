import { Schema } from "mongoose";
import db from "../../config/db.js";
// import {
//   readingAxis,
//   movementDirection,
//   exercises,
//   trialStatus,
// } from "./enum.js";

let schema = Schema;



export const calibrationSchema = new schema({
    calibrationId: { type: String, required:true },
    positionZero: { type: Number, required: true },
    optimalPosition: { type: Number, required: true },
    maxPosition: { type: Number, required: true },
    auditoryFeedback: { type: Number, required: true },
    auditoryStimulus: { type: Number, required: true },
    updatedBy:{type:String}
  },
  {
    _id: false,
  }
);

// const exerciseAttributeSchema = new schema(
//   {
//     movementDirection: {
//       type: String,
//       enum: Object.values(movementDirection),
//       required: true,
//     },
//     readingAxis: {
//       type: String,
//       enum: Object.values(readingAxis),
//       required: true,
//     },
//   },
//   {
//     _id: false,
//   }
// );

// const moduleSchema = new schema(
//   {
//     moduleId: { type: String, required: true },
//     description: { type: String, required: true },
//     motionPlane: { type: String, required: true },
//     exerciseName: { type: String, required: true },
//     exercise: { type: String, enum: Object.values(exercises), required: true },
//     exerciseAttributes: exerciseAttributeSchema,
//   },
//   {
//     _id: false,
//   }
// );


//all ids will be changed to unique id instead of objectid
// const trialSchema = new schema(
//   {
//     trialId: { type: String, required: true, unique: true },
//     trialName: { type: String },
//     trialDate: { type: Date },
//     // exercise: { type: schema.Types.ObjectId, ref: "PatientExercise" },
//     calibration: calibrationSchema,
//     patientId: { type: String, required: true },
//     exerciseId: { type: String, required: true},
//     profileId: { type: String, required: true },
//     profileName: { type: String },
//     position: { type: String },
//     positionId: { type: String },
//     // profile: { type: schema.Types.ObjectId, ref: "Profile" },
//     appreciationStimulus: [{ type: Number }],
//     onDemandStimulus: [{ type: Number }],
//     initialStimulus: { type: Number },
//     startTime: { type: Date },
//     endTime: { type: Date },
//     remarks: { type: String },
//     completionRemarks: { type: String },
//     exerciseCompletedFully: { type: Boolean },
//     optimalThreshold: { type: String },
//     deviceAddress: { type: String },
//     trialStatus: {
//       type: String,
//       enum: Object.values(trialStatus),
//       required: true,
//     },
//   },
//   {
//     collection: "Trials",
//   }
// );

const patientExerciseSchema = new schema(
  {
    patientId: { type: String, required: true },
    exerciseId: { type: String, required: true },
    // patientInfo: { type: Object, required: true },
    // patientInfo: { type: String },//???
    sessionDate: { type: Date, required: true },
    // trials: [{ type: Schema.Types.ObjectId, ref: "Trial" }],//once exercise created then only trials will be created.am i right?
    calibration: { type: calibrationSchema, required: true },
    moduleId: { type: String, required: true },//module schema having moduleid is it required?
    //  module: moduleSchema,//master table or embedded??
    // module: { type: moduleSchema, required: true },
    positionId: { type: String, required: true },
    sessionName: { type: String, default: null },
    deviceAddress: { type: String, default: null },
    createdTime: { type: Date },
    endTime: { type: Date },
    remarks: { type: String, default: null },
    lastTrailDate: { type: Date },
  },
  {
    collection: "Session",
    versionKey: false
  }
);

const PatientExercise = db.model("Session", patientExerciseSchema);
// const Trial = db.model("Trial", trialSchema);


export default PatientExercise;
  // Trial,
  

