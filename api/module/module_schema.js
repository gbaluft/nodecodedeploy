import { Schema } from "mongoose";
import db from "../../config/db.js";
import {
  readingAxis,
  movementDirection,
  exercises
} from "../patientexercise/enum.js";

let schema = Schema;

const exerciseAttributeSchema = new schema(
    {
      movementDirection: {
        type: String,
        enum: Object.values(movementDirection),
        required: true,
      },
      readingAxis: {
        type: String,
        enum: Object.values(readingAxis),
        required: true,
      },
    },
    {
      _id: false,
    }
  );
  
  const moduleSchema = new schema(
    {
      moduleId: { type: String, required: true },
      description: { type: String, required: true },
      motionPlane: { type: String, required: true },
      exerciseName: { type: String, required: true },
      exercise: { type: String, enum: Object.values(exercises), required: true },
      exerciseAttributes: exerciseAttributeSchema,
    },
    {
        collection: "Module",
        versionKey: false,
        strict: true
    //   _id: false,
    }
  );
  const module = db.model("Module", moduleSchema);
  export default module;