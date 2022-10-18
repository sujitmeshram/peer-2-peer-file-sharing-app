require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const path = require("path");
const cors = require("cors");
// Cors
const corsOptions = {
  origin: process.env.ALLOWED_CLIENTS.split(","),
  // ['http://localhost:3000', 'http://localhost:5000', 'http://localhost:3300']
};

// Default configuration looks like
// {
//     "origin": "*",
//     "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
//     "preflightContinue": false,
//     "optionsSuccessStatus": 204
//   }

app.use(cors(corsOptions));
app.use(express.static("public")); //css was not working, so added this line, basically its refering to public folder

//importing db
const connectDB = require("./config/db");
connectDB(); //calling connectDB

app.use(express.json());

//Template engine
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

// Routes
app.use("/api/files", require("./routes/files")); //if we    "/api/files" url then send it to "./routes/files"
app.use("/files", require("./routes/show")); //if ask for "/files" then send it to "/routes/show"
app.use("/files/download", require("./routes/download")); //refering to 'routes/download'

//listening on port
app.listen(PORT, console.log(`Listening on port ${PORT}.`));
