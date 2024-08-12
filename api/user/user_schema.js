import { Schema } from "mongoose";
import db from "../../config/db.js";
import bcrypt from "bcryptjs";

let schema = Schema;

let userSchema = new schema(
  {
    userID: {
      type: String,
      unique: [true, "User already exists "],
      // required: [true, "Enter user id"],
    },
    // firstName: {
    //   type: String,
    //   required: [true, "Please enter your first name"],
    // },
    // lastName: {
    //     type: String,
    //     required: [true, "Please enter your last name"]
    // },
    userName:{ type: String,required: [true, "Please enter your user name"],},
    // email: {
    //   type: String,
    //   required: [true, "Please enter an email"],
    //   lowercase: true,
    // },
    // photo: String,
    password: {
      type: String,
      required: [true, "Please enter a password"],
      minlength: 8,
    },
    // confirm password only for validating the passwords match not storing in db
    // confirmPassword: {
    //   type: String,
    //   required: [true, "Please enter confirm password"],
    //   validate: {
    //     validator: function (v) {
    //       return v === this.password;
    //     },
    //     message: "Passwords must match"
    //   }
      
    // },
    role: { type: String, enum:['superadmin','admin','clinicadmin','doctor','patient'],default: 'patient'},
    remark: { type: String, default: "", uppercase: true, trim: true },
    isActive: { type: String, default:"Y", enum: ['N','Y']},
    activeStartDate: { type: Date, default: Date.now },
    activeEndDate: { type: Date, default: null },
    createdBy: { type: String, default: "" },
    createdDate: { type: Date, default: Date.now },
    updatedBy: { type: String, default: "" },
    updatedDate: { type: Date, default: null },
    version: { type: Number, default: 1 },
    versionRemark: { type: String, uppercase: true, default: "1: BASELINE" },
  },
  {
    versionKey: false,
    strict: true,
    collection: "User",
  }
);

userSchema.pre('save', async function(next) {
  if (this.isModified('password') || this.isNew) {
    try {
      const salt = await bcrypt.genSalt(parseInt(process.env.SALT_WORK_FACTOR));
      this.password = await bcrypt.hash(this.password, salt);
      // this.confirmPassword = undefined;
      next();
    } catch (err) {
      next(err);
    }
  } else {
    return next();
  }
});

const user = db.model("User", userSchema);
export default user;
