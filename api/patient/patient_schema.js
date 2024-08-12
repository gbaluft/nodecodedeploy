import { Schema } from "mongoose";
import db from "../../config/db.js";

let schema = Schema;


let addressSchema = new schema(
  {
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
  },
  {
    _id: false,
  }
);
// const GenderEnum = ['Male', 'Female', 'Other'];
export const GenderEnum = {
  MALE: 1,
  FEMALE: 2,
  OTHER: 3
};
let patientsSchema = new schema(
  {
    patientId: { type: String, required: true, unique: true },//uuid unique id
    firstName: { type: String },
    lastName: { type: String },
    // gender: { type: Number, enum: GenderEnum , required: true },
    gender: {type: Number, enum: [GenderEnum.MALE, GenderEnum.FEMALE, GenderEnum.OTHER],required: true},
    dateOfBirth: { type: String, default: null,required:true},
    address: addressSchema,
    mobileNumber: { type: String },
    guardianName: { type: String, default: null },
    primaryProblem: { type: String  },
    surgeries: { type: String, default: null },
    hospitalization: { type: String },
    treatments: { type: String },
    allergies: { type: String },
    medicalProblems: { type: String },
    lastTrial: { type: String, default: null },
    createdTime: { type: String, default: Date.now},
    remark: { type: String, default: "", uppercase: true, trim: true },
    isActive: {
      type: String,
      required: [true, "Enter a active status"],
      default: "Y",
    },
    // activeStartDate: { type: Date, default: Date.now },
    // activeEndDate: { type: Date, default: null },
    createdBy: { type: String, default: "" },
    updatedBy: { type: String, default: "" },
    updatedDate: { type: String, default: null },
    // version: { type: Number, default: 1 },
    // versionRemark: { type: String, uppercase: true, default: "1: BASELINE" },
  },
  {
    versionKey: false,
    // strict: true,
    collection: "Patient",
  }
);
const patient = db.model("Patient", patientsSchema);
export default patient;
