

import LoginService from "./login_service.js";
import AppError from "../../../core/util/error_handler/custom_error_message.js";
import login_service from "./login_service.js";

export default {
    login,
    accessToken
}


async function login(req, res, next) {
    try {
        let body = req.body ?? {};
        let userData = await LoginService.login(body);
        console.log(userData, 'data');
        res.status(200).json({
            status: 200,
            message: "Successfully logged in",
            data: userData
        });
    } catch (err) {
        console.log('Error in login:', err);
        next(err); 
    }
}

async function accessToken(req, res, next) {
    try {
        const refreshToken = req.body.refreshToken;
        // console.log(refreshToken)
        const newAccessToken = await login_service.refreshTokenService(refreshToken);
        res.status(200).json({ accessToken: newAccessToken });
    } catch (err) {
        next(err); 
    }
}