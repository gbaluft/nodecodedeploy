import PatientService from "./patient_service.js";
import AppError from "../../core/util/error_handler/custom_error_message.js";

export default {
  createPatient,
  getPatientList,
  getPatientById,
  updatePatient,
  deletePatientById,
  deleteAllPatients,
  filterPatients,
};

async function createPatient(req, res, next) {
  try {
    const body = req.body ?? {};
    let result = await PatientService.createPatient(body);
    res.status(200).json({
      status: "success",
      message: "Successfully created",
    });
  } catch (err) {
    // const error = new AppError(err.message, 400);
    next(err);
  }
}

async function getPatientList(req, res, next) {
  try {
    let result = await PatientService.getPatientsList();
    res.status(200).json({
      status: "success",
      result,
    });
  } catch (err) {
    // console.error("Error retrieving patients:", err);
    // const error = new AppError(err.message, 404);
    next(err);
  }
}

// async function getPatientById(req, res, next) {
//   try {
//     const patientID = (await req.query.patientId) ?? null;
//     let patient = await PatientService.getPatientById(patientID);
//     res.status(200).json({
//       status: "success",
//       patient,
//     });
//   } catch (err) {
//     next(err);
//   }
// }

async function getPatientById(req, res, next) {
  try {
    const { patientId } = req.params;
    const patient = await PatientService.getPatientById(patientId);
    res.status(200).json({
      status: "success",
      patient,
    });
  } catch (err) {
    next(err);
  }
}

async function filterPatients(req, res, next) {
  try {
    const { searchTxt } = req.query ;
    // console.log(req.query)
    const patients = await PatientService.filterPatients(searchTxt);
    // console.log('patient',patients)
    res.status(200).json({
      status: "success",
      patients,
    });
  } catch (err) {
    next(err);
  }
}

async function updatePatient(req, res, next) {
  try {
    const body = req.body ?? {};
    let result = await PatientService.updatePatient(body);
    res.status(200).json({
      status: "success",
      result,
    });
  } catch (err) {
    // console.error("Error retrieving patients:", err);
    const error = new AppError(err.message, 404);
    next(error);
  }
}
async function deletePatientById(req, res, next) {
  try {
    const { patientId } = req.params;
    // console.log(patientId, "patientId");
    const result = await PatientService.deletePatientById(patientId);
    res.status(200).json({
      status: "success",
      message: result
    });
  } catch (err) {
    next(err);
  }
}
async function deleteAllPatients(req, res, next) {
  try {
    const result = await PatientService.deleteAllPatients();
    res.status(200).json({
      status: "success",
      message: result,
    });
  } catch (err) {
    next(err);
  }
}
// async function deletePatient(req, res, next) {
//   try {
//     const patientId = req.query.patientID ?? null;
//     console.log(patientId, "pa");
//     await PatientService.deletePatient(patientId);
//     res.status(200).send("Successfully deleted");
//   } catch (err) {
//     const error = new AppError(err.message, 404);
//     next(error);
//   }
// }
