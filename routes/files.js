//
const router = require("express").Router();
const multer = require("multer"); //Multer is a node. js middleware for handling multipart/form-data , which is primarily used for uploading files.
const path = require("path");
const File = require("../models/file");
const { v4: uuidv4 } = require("uuid"); //for version4

//using multer
let storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    //for creating unique filename to avoid filename conflicts
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`; //path.extname tells us the extension of file
    cb(null, uniqueName);
  },
});

let upload = multer({ storage, limits: { fileSize: 1000000 * 100 } }).single(
  "myfile"
); //100mb, storage is above storage, filesize in byte so wrote 1000000==1mb and multiplying to 100 for 100mb

router.post("/", (req, res) => {
  //calling upload function for store file
  upload(req, res, async (err) => {
    //for handling error
    if (err) {
      return res.status(500).send({ error: err.message });
    }

    //store into database for using "File" Model
    const file = new File({
      filename: req.file.filename, //getting filename
      uuid: uuidv4(), //generating uuid
      path: req.file.path,
      size: req.file.size,
    });

    const response = await file.save(); //saving file

    res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` }); //sending unique download link
  });
});

//for sending emails
router.post("/send", async (req, res) => {
  const { uuid, emailTo, emailFrom, expiresIn } = req.body; //getting uuid, emailTo, emailFrom, expiresIn form body
  if (!uuid || !emailTo || !emailFrom) {
    return res
      .status(422)
      .send({ error: "All fields are required except expiry." });
  }
  // Getting data from db
  try {
    const file = await File.findOne({ uuid: uuid });
    if (file.sender) {
      return res.status(422).send({ error: "Email already sent once." });
    }
    file.sender = emailFrom;
    file.receiver = emailTo;
    const response = await file.save();
    // send mail
    const sendMail = require("../services/mailService");
    sendMail({
      from: emailFrom,
      to: emailTo,
      subject: "p2p File Sharing",
      text: `${emailFrom} shared a file with you.`,

      //calling function and sending required parameter
      html: require("../services/emailTemplate")({
        emailFrom,
        downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}?source=email`,
        size: parseInt(file.size / 1000) + " KB", //sending file size
        expires: "24 hours",
      }),
    })
      .then(() => {
        return res.json({ success: true });
      })
      .catch((err) => {
        return res.status(500).json({ error: "Error in email sending." });
      });
  } catch (err) {
    return res.status(500).send({ error: "Something went wrong." });
  }
});

module.exports = router;
