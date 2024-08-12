import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import User from "../user_schema.js";
import AppError from "../../../core/util/error_handler/custom_error_message.js";
import UserSession from "../../usersession/user_session_schema.js";


export default {
  login,
  refreshTokenService,
};

async function login(body) {
  // let userType = body.userType;
  // if(userType == "") {
  const uuid = uuidv4();
  // let userName = body.userName || body.email;
  let userName = body.userName
  let password = body.password;
  let sessionKey = uuid;
  // const findUser = await User.findOne({
  //   $or: [{ userName: userName }, { email: userName }],
  // });
  const findUser = await User.findOne({userName:userName})
  console.log("findUser", findUser);
  if (findUser) {
    let comparePassword = await bcrypt.compare(password, findUser.password);
    if (comparePassword) {
      const token = jwt.sign(
        { userID: findUser.userID, role :findUser.role },
        process.env.SECRET_KEY + sessionKey,
        { expiresIn: process.env.TOKEN_EXPIRY_TIME }
      );
      const refreshToken = jwt.sign(
        { userID: findUser.userID },
        process.env.SECRET_KEY + sessionKey,
        { expiresIn: process.env.REFRESHTOKEN_EXPIRY_TIME }
      );
      // await storeRefreshToken(findUser.userID,refreshToken)
      // const refreshToken = jwt.sign({ userName: findProvider.username },process.env.SECRET_KEY, { expiresIn: process.env.TOKEN_EXPIRY_TIME });
      //   console.log("token", token);
      let responseObj = {};
      responseObj.userName = findUser.userName;
      responseObj.userID = findUser.userID;
      // responseObj.firstName = findUser.firstName;
      // responseObj.lastName = findUser.lastName;
      // responseObj.email = findUser.email;
      responseObj.role = findUser.role;
      responseObj.isActive = findUser.isActive;
      // responseObj.userType = "PROVIDER";
      responseObj.token = token;
      responseObj.refreshToken = refreshToken;
      await createUserSession(
        findUser.userName,
        sessionKey,
        "User",
        findUser.userID
      );
      //   console.log(responseObj,'response')
      return responseObj;
    } else {
      throw new AppError("Incorrect password", 401);
    }
  } else {
    throw new AppError("User not found", 404);
  }
  // }
  // else {
  //     throw new AppError("Incorrect User Type", 400);
  // }
}

// async function storeRefreshToken (userId,refreshToken){
//     await User.findByIdAndUpdate(userId,{refreshToken:refreshToken})
// }

async function createUserSession(userName, sessionKey, collectionName, userID) {
  let findUserSession = await UserSession.findOne({ userSessionID: userID });
  console.log(findUserSession,'findusersession')
  if (!findUserSession) {
    var userSession = new UserSession();
    userSession.userSessionID = userID;
    userSession.sessionKey = sessionKey;
    userSession.applicationId = process.env.APP_ID;
    userSession.userName = userName;
    userSession.collectionName = collectionName;
    userSession.isActive = "Y";
    userSession.createdBy = userID;
    await userSession.save();
  } else {
    let activeUserSession = await UserSession.updateMany(
      { userName: userName, isActive: "Y" },
      {
        $set: {
          isActive: "N",
          updatedBy: userID,
          updatedDate: new Date(),
          endDate: new Date(),
          activeEndDate: new Date(),
        },
      }
    );
    if (activeUserSession) {
      var userSession = new UserSession();
      userSession.userSessionID = userID;
      userSession.sessionKey = sessionKey;
      userSession.applicationId = process.env.APP_ID;
      userSession.userName = userName;
      userSession.collectionName = collectionName;
      userSession.isActive = "Y";
      userSession.createdBy = userID;
      await userSession.save();
    }
  }
}

async function refreshTokenService(refreshToken) {
  // console.log(refreshToken);
  if (!refreshToken) {
    throw new AppError("No Authorizationnn Provided", 401);
  }
  const decoded = jwt.decode(refreshToken, { complete: true });
  // console.log(decoded, "decoded");
  if (!decoded || !decoded.payload) {
    throw new AppError("Invalid Token", 401);
  }
  const userData = await UserSession.findOne({
    userSessionID: decoded.payload.userID,
    isActive: "Y",
  });
  // console.log(userData, "userData");
  if (!userData) {
    throw new AppError("Token has expired or session is inactive", 401);
  } else {
    try {
     
      await new Promise((resolve, reject) => {
        jwt.verify(
          refreshToken,
          process.env.SECRET_KEY + userData.sessionKey,
          (err, decoded) => {
            if (err) reject(err);
            resolve(decoded);
          }
        );
      });
    } catch (error) {
      // console.error("JWT Verification Error", error);
      throw new AppError("Invalid Token", 401);
    }
  
    const newAccessToken = jwt.sign(
      { userID: decoded.payload.userID , role:decoded.payload.role},
      process.env.SECRET_KEY + userData.sessionKey,
      { expiresIn: process.env.TOKEN_EXPIRY_TIME }
    );
  
    return newAccessToken;
  }
}

