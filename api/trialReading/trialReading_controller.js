import TrailReadingService from "./trialReading_service.js";
// import AppError from "../../core/util/error_handler/custom_error_message.js";

export default {
    createTrailReading,
    getTrailReadingsByTrailReadingId,
    getTrailReadingsByTrailId,
    updatedTrialReading,
    deleteTrailReading
};

async function createTrailReading(req, res, next) {
  try {
    const body = req.body ?? {};
    let result = await TrailReadingService.createTrailReading(body);
    res.status(200).json({
      status: "success",
      message: "Successfully created",
      // result
    });
  } catch (err) {
    // const error = new AppError(err.message, 400);
    next(err);
  }
}
async function getTrailReadingsByTrailReadingId(req,res,next){
    try{
        const {trailReadingId} = req.params;
        const trailReading = await TrailReadingService.getTrailReadings(trailReadingId);
        res.status(200).json({
            status: 'success',
            data: trailReading
        })
    } catch (err){
        next(err);
    }
}

async function getTrailReadingsByTrailId(req,res,next){
    try{
        const{trailId} = req.params;
        // console.log(trailId,'trailId')
        const trailReading = await TrailReadingService.getTrailReadingsByTrailId(trailId);
        // console.log(trailReading,'trailreading')
        res.status(200).json({
            status: 'success',
            data: trailReading
        })
    } catch (err){
        next(err);
    }
}


async function updatedTrialReading(req, res, next) {
    try {
      const updateData = req.body ?? {};
      const updatedTrialReading = await TrailReadingService.updatedTrialReading(updateData);
      res.status(200).json({
        status: 'success',
        data: updatedTrialReading,
      });
    } catch (err) {
      next(err);
    }
  }

  async function deleteTrailReading(req, res, next) {
    try {
      const { trialId } = req.params;
      const result = await TrailReadingService.deleteTrailReading(trialId);
      res.status(200).json({
        status: "success",
        message: "Successfully deleted",
        // result
      });
    } catch (err) {
      next(err);
    }
  }