import { Schema } from "mongoose";
import db from "../../config/db.js";

let schema = Schema;

const profileFileSchema = new schema(
  {
    fileName: { type: String, required: true },
    filePath: { type: String, required: true },
    // isAudioPlaying: { type: Boolean, default: false },
  },
  {
    _id: false,
  }
);
const profileSchema = new schema(
  {
    profileId: { type: String, required: true, unique: true },
    profileName: { type: String, required: true },
    auditoryStimulus: profileFileSchema,
    auditoryFeedback: profileFileSchema,
    visualFeedback: profileFileSchema,
    stimulusFile1: profileFileSchema,
    stimulusFile2: profileFileSchema,
    stimulusFile3: profileFileSchema,
    // isActive: { type: Boolean, required: true },
    appreciationFeedback: profileFileSchema,
    isActive: {
      type: String,
      required: [true, "Enter a active status"],
      default: "Y",
    },
    // activeStartDate: { type: Date, default: Date.now },
    // activeEndDate: { type: Date, default: null },
    createdBy: { type: String, default: "" },
    createdDate: { type: Date, default: Date.now },
    updatedBy: { type: String, default: "" },
    updatedDate: { type: Date, default: null },
    // version: { type: Number, default: 1 },
    // versionRemark: { type: String, uppercase: true, default: "1: BASELINE" },
  },
  {
    versionKey: false,
    strict:true,
    collection: "Profile",
  }
);

const Profile = db.model("Profile", profileSchema);
export default Profile;
