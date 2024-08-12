
import ProfileService from './profile_service.js';
import path from 'path';
import archiver from 'archiver';
// import fs from 'fs';
import { fileURLToPath } from 'url';
// Convert module URL to file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createProfile(req, res, next) {
  try {
    const body = req.body ?? {};
    const files = req.files;
    // console.log(files,'files')
    //for saving the file as relative path instead of absolute path
    const relativePath = path.relative(path.join(__dirname, '../../'), path.join(__dirname, '../../uploads'));

    body.auditoryStimulus = files.auditoryStimulus ? {
      fileName: files.auditoryStimulus[0].originalname,
      // filePath: files.auditoryStimulus[0].path,// absolute path
      filePath: path.join(relativePath,files.auditoryStimulus[0].filename)
      // isAudioPlaying: false
    } : undefined;
    body.auditoryFeedback = files.auditoryFeedback ? {
      fileName: files.auditoryFeedback[0].originalname,
      // filePath: files.auditoryFeedback[0].path,//absolutePath
      filePath: path.join(relativePath,files.auditoryFeedback[0].filename)
      // isAudioPlaying: false
    } : undefined;
    body.visualFeedback = files.visualFeedback ? {
      fileName: files.visualFeedback[0].originalname,
      // filePath: files.visualFeedback[0].path,
      filePath: path.join(relativePath, files.visualFeedback[0].filename)
      // isAudioPlaying: false
    } : undefined;
    body.appreciationFeedback = files.appreciationFeedback ? {
      fileName: files.appreciationFeedback[0].originalname,
      // filePath: files.appreciationFeedback[0].path,
      filePath: path.join(relativePath,files.appreciationFeedback[0].filename)
      // isAudioPlaying: false
    } : undefined;
    body.stimulusFile1 = files.stimulusFile1 ? {
      fileName: files.stimulusFile1[0].originalname,
      filePath: path.join(relativePath, files.stimulusFile1[0].filename)
    } : undefined;

    body.stimulusFile2 = files.stimulusFile2 ? {
      fileName: files.stimulusFile2[0].originalname,
      filePath: path.join(relativePath, files.stimulusFile2[0].filename)
    } : undefined;

    body.stimulusFile3 = files.stimulusFile3 ? {
      fileName: files.stimulusFile3[0].originalname,
      filePath: path.join(relativePath, files.stimulusFile3[0].filename)
    } : undefined;

    const result = await ProfileService.createProfile(body);

    res.status(200).json({
      status: 'success',
      message: 'Successfully created',
      data: result,
    });
  } catch (err) {
    console.log(err, 'err');
    next(err);
  }
}

// async function getProfileById(req, res) {
//   try {
//     const profile = await profileService.getProfileById(req.query.id);;
//     res.status(200).json({
//       status:'success',
//       data:profile
//     });
//   } catch (err) {
//     console.log(err, 'err');
//     next(err);
//   }
// }
async function getProfileByProfileId(req, res,next) {
  try {
    const profileId = req.query.profileId
    const profile = await ProfileService.getProfileByProfileId(profileId);
    res.status(200).json({
      status:'success',
      data:profile
    });
  } catch (err) {
    // console.log(err, 'err');
    next(err);
  }
}

async function getAllProfiles (req,res,next) {
  try{
    const profile = await ProfileService.getProfiles();
    res.status(200).json({
      status:"success",
      data:profile
    });
  }catch(err){
    next(err);
  }
}

async function updateProfile(req, res, next) {
  try {
    const body = req.body ?? {};
    const files = req.files;

    body.auditoryStimulus = files.auditoryStimulus ? {
      fileName: files.auditoryStimulus[0].originalname,
      filePath: path.join(relativeUploadPath, files.auditoryStimulus[0].filename),
      isAudioPlaying: false
    } : body.auditoryStimulus;

    body.auditoryFeedback = files.auditoryFeedback ? {
      fileName: files.auditoryFeedback[0].originalname,
      filePath: path.join(relativeUploadPath, files.auditoryFeedback[0].filename),
      isAudioPlaying: false
    } : body.auditoryFeedback;

    body.visualFeedback = files.visualFeedback ? {
      fileName: files.visualFeedback[0].originalname,
      filePath: path.join(relativeUploadPath, files.visualFeedback[0].filename),
      isAudioPlaying: false
    } : body.visualFeedback;

    body.appreciationFeedback = files.appreciationFeedback ? {
      fileName: files.appreciationFeedback[0].originalname,
      filePath: path.join(relativeUploadPath, files.appreciationFeedback[0].filename),
      isAudioPlaying: false
    } : body.appreciationFeedback;

    body.stimulusFile1 = files.stimulusFile1 ? {
      fileName: files.stimulusFile1[0].originalname,
      filePath: path.join(relativePath, files.stimulusFile1[0].filename)
    } : body.stimulusFile1;

    body.stimulusFile2 = files.stimulusFile2 ? {
      fileName: files.stimulusFile2[0].originalname,
      filePath: path.join(relativePath, files.stimulusFile2[0].filename)
    } : body.stimulusFile2;

    body.stimulusFile3 = files.stimulusFile3 ? {
      fileName: files.stimulusFile3[0].originalname,
      filePath: path.join(relativePath, files.stimulusFile3[0].filename)
    } : body.stimulusFile3;

    const result = await ProfileService.updateProfile(body);

    res.status(200).json({
      status: 'success',
      message: 'Successfully updated',
      data: result,
    });
  } catch (err) {
    // console.log(err, 'err');
    next(err);
  }
}

//saved in db as absolute path
// async function updateProfile (req, res, next)  {
//   try {
//     const body = req.body ?? {};
//     const files = req.files;

//     body.auditoryStimulus = files.auditoryStimulus ? {
//       fileName: files.auditoryStimulus[0].originalname,
//       filePath: files.auditoryStimulus[0].path,
//       isAudioPlaying: false
//     } : body.auditoryStimulus;
//     body.auditoryFeedback = files.auditoryFeedback ? {
//       fileName: files.auditoryFeedback[0].originalname,
//       filePath: files.auditoryFeedback[0].path,
//       isAudioPlaying: false
//     } : body.auditoryFeedback;
//     body.visualFeedback = files.visualFeedback ? {
//       fileName: files.visualFeedback[0].originalname,
//       filePath: files.visualFeedback[0].path,
//       isAudioPlaying: false
//     } : body.visualFeedback;
//     body.appreciationFeedback = files.appreciationFeedback ? {
//       fileName: files.appreciationFeedback[0].originalname,
//       filePath: files.appreciationFeedback[0].path,
//       isAudioPlaying: false
//     } : body.appreciationFeedback;

//     const result = await ProfileService.updateProfile(body);

//     res.status(200).json({
//       status: 'success',
//       message: 'Successfully updated',
//       data: result,
//     });
//   } catch (err) {
//     console.log(err, 'err');
//     next(err);
//   }
// };

 async function deleteProfile (req, res, next){
  try {
    const { profileId } = req.params;
    // const profileId = req.params.profileId;
    await ProfileService.deleteProfile(profileId);

    res.status(200).json({
      status: 'success',
      message: 'Successfully deleted',
    });
  } catch (err) {
    console.log(err, 'err');
    next(err);
  }
};

const downloadAllFilesAsZip = async (req, res, next) => {
  // try {
  //   const { profileId } = req.params;
  //   const filePaths = await ProfileService.getAllProfileFilePaths(profileId);

  //   if (filePaths.length === 0) {
  //     return res.status(404).json({ message: 'No files found for this profile' });
  //   }

  //   const archive = archiver('zip', { zlib: { level: 9 } });

  //   archive.on('error', (err) => {
  //     throw err;
  //   });

  //   res.attachment(`${profileId}.zip`);

  //   archive.pipe(res);

  //   filePaths.forEach(filePath => {
  //     const fileName = path.basename(filePath);
  //     const fileFullPath = path.resolve(filePath);

  //     // Debugging logs
  //     console.log(`Adding file to archive: ${fileFullPath}`);

  //     if (fs.existsSync(fileFullPath)) {
  //       archive.file(fileFullPath, { name: fileName });
  //     } else {
  //       console.error(`File not found: ${fileFullPath}`);
  //     }
  //   });

  //   await archive.finalize();
  // } catch (err) {
  //   next(err);
  // }

  try {
    const { profileId } = req.params;
    const filePaths = await ProfileService.getAllProfileFilePaths(profileId);

    if (filePaths.length === 0) {
      return res.status(404).json({ message: 'No files found for this profile' });
    }

    const archive = archiver('zip', { zlib: { level: 9 } });

    res.attachment(`${profileId}.zip`);
    archive.pipe(res);

    filePaths.forEach(filePath => {
      const fileName = path.basename(filePath);
      archive.file(filePath, { name: fileName });
    });

    archive.finalize();
  } catch (err) {
    next(err);
  }
};

 async function getProfileByfileProperty (req, res, next) {
  try {
    const { profileId, fileProperty } = req.params;
    const filePath = await ProfileService.getProfileByfileProperty(profileId, fileProperty);
    console.log(filePath,'filepathcontrol')
    res.download(filePath, (err) => {
      if (err) {
        next(err);
      }
    });
  } catch (err) {
    next(err)
  }
}

export default {
  createProfile,
  // getProfileById,
  getProfileByProfileId,
  getAllProfiles,
  updateProfile,
  deleteProfile,
  downloadAllFilesAsZip,
  getProfileByfileProperty
};
