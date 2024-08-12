import { Schema } from "mongoose";
import db from "../../config/db.js";
import {calibrationSchema } from "../patientexercise/patient_exercise_schema.js";
import {trialStatus} from "../patientexercise/enum.js";

let schema = Schema;

const trialSchema = new schema(
    {
      trialId: { type: String, required: true, unique: true },
      trialName: { type: String },
      trialDate: { type: Date },
      // exercise: { type: schema.Types.ObjectId, ref: "PatientExercise" },
      calibration: calibrationSchema,
      patientId: { type: String, required: true },
      exerciseId: { type: String, required: true},
      profileId: { type: String, required: true },
      profileName: { type: String },
      position: { type: String },
      positionId: { type: String },
      // profile: { type: schema.Types.ObjectId, ref: "Profile" },
      appreciationStimulus: [{ type: Number }],
      onDemandStimulus: [{ type: Number }],
      initialStimulus: { type: Number },
      startTime: { type: Date },
      endTime: { type: Date },
      remarks: { type: String },
      completionRemarks: { type: String },
      exerciseCompletedFully: { type: Boolean },
      optimalThreshold: { type: String },
      deviceAddress: { type: String },
      trialStatus: {
        type: String,
        enum: Object.values(trialStatus),
        required: true,
      },
      createdBy: { type: String, default: "" },
      createdDate: { type: Date, default: Date.now },
      updatedBy: { type: String, default: "" },
      updatedDate: { type: Date, default: null },
      updateSessionCalibration: { type: Boolean, default: false }
    },
    {
      collection: "Trials",
      versionKey: false
    }
  );
  const Trial = db.model("Trial", trialSchema);

  export default Trial;