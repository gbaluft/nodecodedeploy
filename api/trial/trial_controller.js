
import TrialService from './trial_service.js';
import AppError from "../../core/util/error_handler/custom_error_message.js";

import fs from 'fs';



async function createTrial(req, res, next) {
  try {
  
    const body = req.body ?? {}
    // console.log(body,'controlbody')
    const trial = await TrialService.createTrial(body);
    res.status(200).json({
        status: "success",
        message: "Successfully created", })
}catch (err){
    // const error = new AppError(err.message, 400);//check duplicate key
    next(err); 
  }
}

async function getTrialDetails(req, res, next) {
  try {
    const { trailId } = req.params;
    // console.log(trailId,'trialID')
    const trialDetails = await TrialService.getTrialDetails(trailId);
    res.status(200).json({
      status: 'success',
      data: trialDetails,
    });
  } catch (err) {
    next(err);
  }
}

async function getTrialsByExerciseId(req, res, next) {
  try {
    const { exerciseId } = req.params;
    // console.log(exerciseId, 'exerciseID'); // This should log the correct exerciseId
    const trials = await TrialService.getTrialsByExerciseId(exerciseId);
    res.status(200).json({
      status: 'success',
      data: trials,
    });
  } catch (err) {
    next(err);
  }
}
// async function createTrial(req, res, next) {
//   try {
//     const body = req.body ?? {};
//     const files = req.files ?? {};

//     body.profile = {
//       profileId: body.profileId,
//       profileName: body.profileName,
//       auditoryStimulus: files.auditoryStimulus ? {
//         fileName: files.auditoryStimulus[0]?.originalname,
//         filePath: files.auditoryStimulus[0]?.path,
//         isAudioPlaying: false
//       } : undefined,
//       auditoryFeedback: files.auditoryFeedback ? {
//         fileName: files.auditoryFeedback[0]?.originalname,
//         filePath: files.auditoryFeedback[0]?.path,
//         isAudioPlaying: false
//       } : undefined,
//       visualFeedback: files.visualFeedback ? {
//         fileName: files.visualFeedback[0]?.originalname,
//         filePath: files.visualFeedback[0]?.path,
//         isAudioPlaying: false
//       } : undefined,
//       appreciationFeedback: files.appreciationFeedback ? {
//         fileName: files.appreciationFeedback[0]?.originalname,
//         filePath: files.appreciationFeedback[0]?.path,
//         isAudioPlaying: false
//       } : undefined,
//     };

//     const result = await TrialService.createTrial(body);
//     res.status(200).json({
//       status: "success",
//       message: "Successfully created",
//       result
//     });
//   } catch (err) {
//     next(err);
//   }
// }

// async function getTrialById(req, res) {
//   try {
//     const trial = await trialService.getTrialById(req.params.id);
//     res.status(200).json(trial);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }

async function updateTrial(req, res, next) {
  try {
    const updateData = req.body ?? {};
    const updatedTrial = await TrialService.updateTrial(updateData);
    res.status(200).json({
      status: 'success',
      data: updatedTrial,
    });
  } catch (err) {
    next(err);
  }
}

// async function updateTrial(req, res) {
//   try {
//     const trial = await trialService.updateTrial(req.body);
//     res.status(200).json(trial);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }

async function deleteTrial(req, res, next) {
  try {
    const { trialId } = req.params;
    // console.log(trialId, 'trialID'); 
    const result = await TrialService.deleteTrialById(trialId);
    res.status(200).json({
      status: 'success',
      message: 'Trial deleted successfully',
      // data: result,
    });
  } catch (err) {
    next(err);
  }
}

// async function deleteTrial(req, res) {
//   try {
//     const result = await trialService.deleteTrial(req.params.id);
//     res.status(204).send(result);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }

const downloadTrialDetails = async (req, res) => {
  try {
    const trialId = req.params.trialId;
    const filePath = await TrialService.downloadTrialDetails(trialId);
    res.download(filePath, (err) => {
      if (err) {
        console.error('error', err);
        res.status(500).send('Error downloading file');
      } else {
        fs.unlinkSync(filePath); // Clean up the temporary file
      }
    });
  } catch (error) {
    console.error('error', error);
    res.status(500).send('Error generating file');
  }
};

export default {
  createTrial,
  // getTrialById,
  getTrialDetails,
  getTrialsByExerciseId,
  updateTrial,
  deleteTrial,
  downloadTrialDetails
};