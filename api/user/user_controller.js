import UserService from "./user_service.js";
import AppError from "../../core/util/error_handler/custom_error_message.js";

export default {
  signupUser,
  registerSuperAdmin
};

async function registerSuperAdmin(req, res, next) {
  try {
    const body = req.body ?? {};
    let result = await UserService.registerSuperAdmin(body);
    res.status(201).json({
      status: "success",
      message: "You are signed up!",
      data: result
    });
  } catch (err) {
    // const error = new AppError(err.message, 400);
    next(err);
  }
}

async function signupUser(req, res, next) {
  try {
    const body = req.body ?? {};
    let result = await UserService.signupUser(body);
    res.status(201).json({
      status: "success",
      message: "You are signed up!",
      data: result
    });
  } catch (err) {
  next(new AppError(err.message, 400));
  }
}
