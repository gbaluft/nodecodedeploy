import Module from "./module_schema.js";
import AppError from "../../core/util/error_handler/custom_error_message.js";
import { v4 as uuidv4 } from "uuid";

export default {
  createModule,
  getModule,
  getModules,
  updateModule,
  deleteModule
};

async function createModule(body) {
  if (!body || Object.keys(body).length === 0) {
    throw new AppError("Invalid body parameter", 400);
  }

  const moduleDetails = new Module({
    moduleId: uuidv4(),
    description: body.description,
    motionPlane: body.motionPlane,
    exerciseName: body.exerciseName,
    exercise: body.exercise,
    exerciseAttributes: body.exerciseAttributes,
  });

  await moduleDetails.save();

  return moduleDetails;
}

async function getModule(moduleId) {
  if (!moduleId) {
    throw new AppError("Invalid moduleId", 400);
  }
  const module = await Module.findOne({ moduleId });

  if (!module) {
    throw new AppError("No module found", 404);
  }
  return module;
}

async function getModules() {
  const modules = await Module.find();
  return modules;
}

async function updateModule(body) {
  if (!body.moduleId) {
    throw new AppError("Provide moduleId", 400);
  }

  const updatedModule = await Module.findOneAndUpdate(
    { moduleId:body.moduleId },
    {
      $set: {
        description: body.description,
        motionPlane: body.motionPlane,
        exerciseName: body.exerciseName,
        exercise: body.exercise,
        exerciseAttributes: body.exerciseAttributes,
      },
    },
    { new: true }
  );

  if (!updatedModule) {
    throw new AppError("Module not found", 404);
  }

  return updatedModule;
}

async function deleteModule(moduleId) {
  if (!moduleId) {
    throw new AppError("Invalid moduleId parameter", 400);
  }

  const deletedModule = await Module.findOneAndDelete({ moduleId });

  if (!deletedModule) {
    throw new AppError("Module not found", 404);
  }

  return "Module successfully deleted";
}