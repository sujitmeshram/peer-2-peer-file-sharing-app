const connectDB = require("./config/db");
const File = require("./models/file");
const fs = require("fs");

connectDB(); //connecting db to work for below code

// Get all records older than 24 hours
async function fetchData() {
  const files = await File.find({
    createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  });
  if (files.length) {
    for (const file of files) {
      try {
        fs.unlinkSync(file.path); //deleting file here
        await file.remove(); //deleting file from database
        console.log(`successfully deleted ${file.filename}`);
      } catch (err) {
        console.log(`error while deleting file ${err} `);
      }
    }
  }
  console.log("Job done!");
}

fetchData().then(process.exit);
