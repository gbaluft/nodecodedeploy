import ModuleService from "./module_service.js";

export default {
  createModule,
  getModuleById,
  getModules,
  updateModule,
  deleteModule
};

async function createModule(req, res, next) {
  try {
    const body = req.body ?? {};
    let result = await ModuleService.createModule(body);
    res.status(200).json({
      status: "success",
      message: "Successfully created",
      result
    });
  } catch (err) {
    next(err);
  }
}

async function getModuleById(req, res, next) {
  try {
    const { moduleId } = req.params;
    const module = await ModuleService.getModule(moduleId);
    res.status(200).json({
      status: 'success',
      data: module
    });
  } catch (err) {
    next(err);
  }
}

async function getModules(req, res, next) {
  try {
    const modules = await ModuleService.getModules();
    res.status(200).json({
      status: 'success',
      data: modules
    });
  } catch (err) {
    next(err);
  }
}

async function updateModule(req, res, next) {
  try {
    // const { moduleId } = req.params;
    const body = req.body ?? {};
    const updatedModule = await ModuleService.updateModule(body);
    res.status(200).json({
      status: 'success',
      data: updatedModule,
    });
  } catch (err) {
    next(err);
  }
}

async function deleteModule(req, res, next) {
  try {
    const { moduleId } = req.params;
    const result = await ModuleService.deleteModule(moduleId);
    res.status(200).json({
      status: "success",
      message: "Successfully deleted",
    //   result
    });
  } catch (err) {
    next(err);
  }
}
