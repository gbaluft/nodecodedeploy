import jwt from "jsonwebtoken";
import util from "util";

import globalErrorHandler from "../util/error_handler/global_error_handler.js";
import UserSession from "../../api/usersession/user_session_schema.js";
import logger from "../logger/logger.js";
import AppError from "../util/error_handler/custom_error_message.js";
export default {
    protect,
    authorizeRoles
}



async function protect(req, res, next) {
  try {
    // Read the token from the Authorization header
    let token = req.headers.authorization;
    console.log(token, "token");

    if (!token || !token.startsWith("Bearer ")) {
      return next(new AppError("No Authorization provided", 401));
    }

    token = token.split("Bearer ")[1];

    // Decode the token
    let decoded = jwt.decode(token, { complete: true });
    console.log(decoded, "decoded");

    if (!decoded || !decoded.payload) {
      return next(new AppError("Invalid token!", 401));
    }

    const userID = decoded.payload.userID;
    console.log(userID, "userID from decoded token");

    // Check if the session is active
    let sessionData = await UserSession.findOne({
      userSessionID: userID,
      isActive: "Y",
    });
    console.log(sessionData, "sessiondata");

    if (!sessionData) {
      return next(new AppError("Session not found or expired!", 401));
    }

    // Validate the token with session key
    let tokenData = await util.promisify(jwt.verify)(
      token,
      process.env.SECRET_KEY + sessionData.sessionKey,
      { expiresIn: process.env.TOKEN_EXPIRY_TIME }
    );
    console.log(tokenData, "tokenData");

    if (!tokenData) {
      return next(new AppError("Invalid token!", 401));
    }

    // Attach user info to the request object
    req.user = {
      userID: decoded.payload.userID,
      role: decoded.payload.role
    };

    res.set({
      "Content-Type": "application/json;odata=verbose",
      Authorization: `Bearer ${token}`,
    });

    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return next(new AppError("Token expired!", 401));
    } else {
      logger.info("err   " + err);
      return next(new AppError("Authentication failed!", 500));
    }
  }
}




// async function protect(req, res, next) {
//   try {
//     // Read the token and check if it found
//     let token = req.headers.authorization;
//     console.log(token, "token");
//     if (!token) {
//           next(new AppError("You are not logged in!", 401));
//         }
//     if (token && token.startsWith("Bearer ")) {
//       token = token.split("Bearer ")[1];
//     }
//     //check the user exists and status active
//     let decoded = jwt.decode(token, { complete: true });
//     console.log(decoded, "decoded");
//     const userID = decoded.payload.userID;
//     console.log(userID, "userID from decoded token");
//     if (decoded != null && decoded != undefined) {
//       let sessionData = await UserSession.findOne({
//         userSessionID: userID,
//         isActive: "Y",
//       });
//       console.log(sessionData, "sessiondata");
//       if (!sessionData) {
//         let custErr = new Error();
//         custErr.name = "TokenExpiredError";
//         globalErrorHandler({ name: "TokenExpiredError" }, req, res);
//       } else {
//         //validate the token
//         let tokenData = await util.promisify(jwt.verify)(
//           token,
//           process.env.SECRET_KEY + sessionData.sessionKey,
//           { expiresIn: process.env.TOKEN_EXPIRY_TIME }
//         );
//         console.log(tokenData, "tokenData");
//         if (!tokenData) {
//           let custErr = new Error();
//           custErr.name = "TokenExpiredError";
//           globalErrorHandler({ name: "TokenExpiredError" }, req, res);
//         } else {
//             req.user = {
//               userID: decoded.payload.userID,
//               role: decoded.payload.role
//               };
//           res.set({
//             "Content-Type": "application/json;odata=verbose",
//             Authorization: token,
//           });
//           next();
//         }
//       }
//     } else {
//       let custErr = new Error();
//       custErr.name = "NoAuthorizationProvided";
//       globalErrorHandler(custErr, req, res);
//     }
//   } catch (err) {
//     if (err instanceof jwt.TokenExpiredError) {
//       let custErr = new Error();
//       custErr.name = "TokenExpiredError";
//       globalErrorHandler(custErr, req, res);
//     } else {
//       logger.info("err   " + err);
//       globalErrorHandler(err, req, res);
//     }
//   }
// }

// Role Validation Middleware
function authorizeRoles (...allowedRoles) {
    return (req, res, next) => {
      if (!req.user) {
        const error = new AppError ("Unauthorized access - No user found",403)
        next (error)
        // return res.status(403).json({ message: "Unauthorized access - No user found" });
      }
      if (!allowedRoles.includes(req.user.role)) {
        const error = new AppError ("You do not have permission to perform this action",403)
        next(error)
        // return res.status(403).json({ message: "Unauthorized access - Insufficient permissions" });
      }
      next();
    };
};

// async function protect(req, res, next) {
//   //  Read the token and check if it exist or not
//   const testToken = req.headers.authorization;
//   console.log(testToken);
//   let token;
//   if (testToken && testToken.startsWith("bearer")) {
//     token = testToken.split(" ")[1];
//   }
//   if (!token) {
//     next(new AppError("You are not logged in!", 401));
//   }
//   //  check the user exists and validate the token
//   let decoded = jwt.decode(token, { complete: true });
//   console.log(decoded, "decoded");
//   if (decoded != null && decoded != undefined) {
//     const userData = await UserSession.findOne({
//       userName: decoded.payload.userName,
//       isActive: "Y",
//     });
//     console.log(userData, "user");
//     if (!userData) {
//       let custErr = new Error();
//       custErr.name = "TokenExpiredError";
//       globalErrorHandler({ name: "TokenExpiredError" }, req, res);
//     } else {
//       let tokenData = await util.promisify(jwt.verify)(
//         token,
//         process.env.SECRET_KEY + userData.sessionKey,
//         { expiresIn: process.env.TOKEN_EXPIRY_TIME }
//       );
//       console.log(tokenData, "tokenData");
//       if (!tokenData) {
//         let custErr = new Error();
//         custErr.name = "TokenExpiredError";
//         globalErrorHandler({ name: "TokenExpiredError" }, req, res);
//       } else {
//         res.set({
//           "Content-Type": "application/json;odata=verbose",
//           Authorization: token,
//         });
//         next();
//       }
//     }
//   } else {
//     let custErr = new Error();
//     custErr.name = "NoAuthorizationProvided";
//     globalErrorHandler(custErr, req, res);
//   }
//   next();
// }
