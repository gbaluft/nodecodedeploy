import mongoose from "mongoose";
import dotenv from "dotenv";


//configure env file
dotenv.config();

//connect to MongoDB using the connection uri from the .env file
mongoose
  .connect(process.env.MONGO_URI, {
    // Mongoose with the MongoDB Node.js driver version 4.0.0 and later doesnt require
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    autoIndex: true,
  })
  .then(() => {
    console.log("DB connected successfully");
  })
  .catch(() => {
    console.log("MongoDB connection failure");
  });

//Get the default connection
const db = mongoose.connection;

//Bind connection to error event(to get notification for connection errors)
db.on("error", () => {
  console.log("MongoDB connection error");
});

export default db;
