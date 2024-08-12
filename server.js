import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import compression from "compression";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from 'express-rate-limit';
import swaggerUi from "swagger-ui-express";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// import db from './config/db.js';
import AppError from "./core/util/error_handler/custom_error_message.js";
import globalErrorHandler from './core/util/error_handler/global_error_handler.js';
import logger, {stream} from './core/logger/logger.js'
import PatientRoutes from "./api/patient/patient_route.js";
import PatientExerciseRoutes from "./api/patientexercise/patient_exercise_route.js";
import ProfileRoutes from "./api/profile/profile_route.js";
import TrialRoutes from "./api/trial/trial_route.js";
import TrailReadingRoutes from "./api/trialReading/trailReading_route.js";
import ModuleRoutes from './api/module/module_route.js';
import UserRoutes from './api/user/user_routes.js';
import LoginRoutes from './api/user/login/login_route.js';
// //connecting db file
// db

// Configure env file
dotenv.config();
// Initiating the App
const app = express();
// compress all responses
app.use(compression());
// Apply Middlewares - helmet
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// handling uncaught exception
process.on('uncaughtException', (err) => {
  // console.log (err.name, err.message);
  logger.error(err.name, err.message);
  // console.log('Uncaught exception occured! Shutting down...')
  logger.error('Uncaught exception occured!');
  process.exit(1)
})

//cors
var whitelist = ["http://localhost:6600"];
var corsOptions = {
  methods: ["GET", "POST", "PUT", "DELETE"],
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new AppError("Not allowed by CORS", 403));
    }
  },
};
app.use(cors(corsOptions));

//Logs incoming HTTP requests 
app.use(morgan('tiny',{
  stream: stream
}));

//parses and limits size of the incoming data
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({ extended: true, limit: "50mb", parameterLimit: 50000 })
);

//express-rate-limit -limit repeated requests to public APIs and/or endpoints such as password reset
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, 
	standardHeaders: 'draft-7', 
	legacyHeaders: false	
})
// Apply the rate limiting middleware to all requests.
app.use(limiter);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


//initiating the app-test
app.get("/", (req, res) => {
  res.send("Hello world!!!");
});

app.use("/Patient", PatientRoutes);
app.use('/Exercise',PatientExerciseRoutes);
app.use('/profile',ProfileRoutes);
app.use('/Trail',TrialRoutes);
app.use('/Trail',TrailReadingRoutes);
app.use('/Module',ModuleRoutes);
app.use('/user',UserRoutes);
app.use('/user',LoginRoutes)

//unhandled route error handler
app.all ('*',(req,res,next) =>{ 
  // res.status(404).json({
  //   status:'fail',
  //   message:`Can't find ${req.originalUrl} on the server`
  // })
  // const err = new Error(`Can't find ${req.originalUrl} on the server`); // built in Error constructor in js
  // err.status = 'fail';
  // err.statusCode = 404;
  const err = new AppError (`Can't find ${req.originalUrl} on the server`,404);
  next(err);
})
//global error handling
app.use(globalErrorHandler);

// app.use ((error,req,res,next) => {
//   error.statusCode = error.statusCode || 500;
//   error.status = error.status || 'error'
//   res.status(error.statusCode).json({
//     status:error.statusCode,
//     message: error.message
//   })
// })

//  Application startup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  // console.log(`Server is running on port ${PORT}`);
  logger.info('App listening at http://'+process.env.HOST+':'+process.env.PORT || 3000)
  logger.info('Environment : '+process.env.NODE_ENV);
  logger.info(new Date());
});
