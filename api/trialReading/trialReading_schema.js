import {Schema} from "mongoose";
import db from "../../config/db.js";

let schema = Schema;


const TrialReadingSchema = new schema({
    readingSeriesNumber: {
      type: Number,
      required: true
    },
    angleX: {
      type: Number,
      required: true
    },
    angleY: {
      type: Number,
      required: true
    },
    angleZ: {
      type: Number,
      required: true
    },
    readingTime: {
      type: Date,
      required: true
    },
    time: {
      type: Number,
      required: true
    }
  }, {
    _id: false 
  });
  
  const TrailReadingsSchema = new schema({
    trialId: {
        type: String,
        required: true
    },
    trailReadingId:  { type: String, required: true, unique: true },
    readings: {
      type: [TrialReadingSchema], 
      required: true,
      default: []
    },
    startTime: {
      type: Date,
      required: true
    },
    completedTime: {
      type: Date,
    //   required: true
    },
    remarks: {
      type: String,
      default: null
    }
  }, {
    collection: "TrailReadings"
  });

  const TrailReadings = db.model("TrailReadings",TrailReadingsSchema)

  export default TrailReadings;