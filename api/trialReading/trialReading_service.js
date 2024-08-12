import TrailReadings from "./trialReading_schema.js";
import AppError from "../../core/util/error_handler/custom_error_message.js";
import { v4 as uuidv4 } from "uuid";

export default {
  createTrailReading,
  getTrailReadings,
  getTrailReadingsByTrailId,
  updatedTrialReading,
  deleteTrailReading
};

async function createTrailReading(body) {
  // console.log(body, "readingbody");
  if (!body || Object.keys(body).length === 0) {
    throw new AppError("Invalid body parameter", 400);
  }
  if (!Array.isArray(body.readings)) {
    throw new AppError("Readings must be an array", 400);
  }
  if (!body.trialId) {
    throw new AppError("Path `trialId` is required.", 400);
  }

  const trialReadingDetails = new TrailReadings({
    trailReadingId: uuidv4(),
    trialId: body.trialId,
    readings: body.readings,
    startTime: body.startTime,
    completedTime: body.completedTime,
    remarks: body.remarks,
  });

  await trialReadingDetails.save();

  return trialReadingDetails;
}

async function getTrailReadings(trailReadingId) {
  if (!trailReadingId) {
    throw new AppError("Invalid trailReadingId", 400);
  }
  const trailReading = await TrailReadings.findOne({ trailReadingId });

  if (!trailReading || trailReading.length === 0) {
    throw new AppError(" No trial reading found", 404);
  }
  return trailReading;
}

async function getTrailReadingsByTrailId(trailId) {
  if (!trailId) {
    throw new AppError("Invalid trailId parameter", 400);
  }
  const trailReading = await TrailReadings.aggregate([
    {
      $match: { trialId: trailId },
    },
    {
      $lookup: {
        from: "Trials",
        localField: "trialId",
        foreignField: "trialId",
        as: "trials",
      },
    },
    {
      $unwind: "$trials",
    },
    {
      $project: {
        trialId: 1,
        trailReadingId: 1,
        readings: 1,
        startTime: 1,
        completedTime: 1,
        remarks: 1,
        trials: {
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
        },
      },
    },
  ]);
  return trailReading;
}

async function updatedTrialReading(body) {
    if (!body.trialId) {
        throw new AppError("Provide trialId", 400);
    }

    const updatedTrialReading = await TrailReadings.findOneAndUpdate(
        { trialId: body.trialId },
        {
            $set: {
                // trialId: body.trialId,
                readings: body.readings,
                startTime: body.startTime,
                completedTime: body.completedTime,
                remarks: body.remarks,
            },
        },
        { new: true}
    );

    if (!updatedTrialReading) {
        throw new AppError("Trial reading not found", 404);
    }

    return updatedTrialReading;
}

async function deleteTrailReading(trialId) {
  if (!trialId) {
    throw new AppError("Invalid trialId parameter", 400);
  }

  const deletedTrailReading = await TrailReadings.findOneAndDelete({ trialId });

  if (!deletedTrailReading) {
    throw new AppError("Trial reading not found", 404);
  }

  // return { message: "Trial reading successfully deleted", trialId };
  return "Trial reading successfully deletedd"
}
