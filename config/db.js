//adding db configuration

require("dotenv").config(); //for accessing dotenv variables
const mongoose = require("mongoose");

function connectDB() {
  // Database connection
  mongoose.connect(process.env.MONGO_CONNECTION_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  });

  const connection = mongoose.connection;

  //once connected, then execute following
  connection
    .once("open", () => {
      console.log("Database connected");
    })
    .catch((err) => {
      console.log("Connection failed");
    });
}

module.exports = connectDB;
