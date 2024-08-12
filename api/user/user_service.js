import AppError from "../../core/util/error_handler/custom_error_message.js";
import generateCustomId from "../../core/util/counter/counter_service.js";
import User from "./user_schema.js";
import { v4 as uuidv4 } from "uuid";
export default {
  signupUser,
  registerSuperAdmin
};

async function registerSuperAdmin(body) {
  if (Object.keys(body).length === 0) {
    throw new AppError("Invalid body parameter", 400);
  }
  const findUser = await User.findOne({ role: 'superadmin' });
  if (findUser) {
    throw new AppError("Already a user exists with this role", 409);
  } else {
    // const uuid = uuidv4();
    const userDetails = new User();
    // userDetails.userID =  uuid;
    // userDetails.firstName = body.firstName;
    // userDetails.lastName = body.lastName;
    userDetails.userName = body.userName;
    // userDetails.email = body.email;
    userDetails.password = body.password;
    // userDetails.confirmPassword = body.confirmPassword;
    userDetails.role = body.role;
    userDetails.remark = body.remark;
    userDetails.isActive = "Y";
    userDetails.activeStartDate = new Date();
    userDetails.createdBy = body.userName;
    userDetails.createdDate = new Date();
    await userDetails.save();
    userDetails.userID = userDetails._id;
    await userDetails.save();
    return userDetails;
    
  }
}

async function signupUser(body) {
  if (Object.keys(body).length === 0) {
    throw new AppError("Invalid body parameter", 400);
  }
  const findUser = await User.findOne({ userName: body.userName });
  if (findUser) {
    throw new AppError("Already a user exists with this userName", 409);
  } 
  if(body.role === 'superadmin') {
    throw new AppError("You cannot assign the role of superadmin", 403);
  }
    // const uuid = uuidv4();
    const userDetails = new User();
    // userDetails.userID =  uuid;
    // userDetails.firstName = body.firstName;
    // userDetails.lastName = body.lastName;
    userDetails.userName = body.userName;
    // userDetails.email = body.email;
    userDetails.password = body.password;
    // userDetails.confirmPassword = body.confirmPassword;
    userDetails.role = body.role;
    userDetails.remark = body.remark;
    userDetails.isActive = "Y";
    userDetails.activeStartDate = new Date();
    userDetails.createdBy = body.userName;
    userDetails.createdDate = new Date();
    await userDetails.save();
    userDetails.userID = userDetails._id;
    await userDetails.save();
    return userDetails;
    
  
}
